// End-to-end encryption using Web Crypto API
// - Per-user ECDH keypair (P-256) stored in localStorage
// - Per-conversation shared secret derived via ECDH + HKDF
// - Messages encrypted with AES-256-GCM before transmission

type KeyPair = {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
};

type StoredKeyPair = {
  privateKey: JsonWebKey;
  publicKey: JsonWebKey;
};

const KEYPAIR_STORAGE_KEY = "campusstall_e2ee_keypair";
const ALGORITHM = "ECDH";
const NAMED_CURVE = "P-256";
const HASH = "SHA-256";
const AES_ALGORITHM = "AES-GCM";
const AES_KEY_LENGTH = 256;

// Get or create a keypair, stored in localStorage
export async function getOrCreateLocalKeypair(): Promise<KeyPair> {
  if (typeof window === "undefined") {
    throw new Error("Crypto only available in browser");
  }

  const stored = window.localStorage.getItem(KEYPAIR_STORAGE_KEY);
  if (stored) {
    const parsed: StoredKeyPair = JSON.parse(stored);
    const privateKey = await crypto.subtle.importKey(
      "jwk",
      parsed.privateKey,
      { name: ALGORITHM, namedCurve: NAMED_CURVE },
      true,
      ["deriveKey", "deriveBits"],
    );
    const publicKey = await crypto.subtle.importKey(
      "jwk",
      parsed.publicKey,
      { name: ALGORITHM, namedCurve: NAMED_CURVE },
      true,
      [],
    );
    return { privateKey, publicKey };
  }

  // Generate new keypair
  const keypair = (await crypto.subtle.generateKey(
    { name: ALGORITHM, namedCurve: NAMED_CURVE },
    true,
    ["deriveKey", "deriveBits"],
  )) as CryptoKeyPair;

  // Export and store
  const privateKeyJwk = await crypto.subtle.exportKey("jwk", keypair.privateKey);
  const publicKeyJwk = await crypto.subtle.exportKey("jwk", keypair.publicKey);

  const toStore: StoredKeyPair = {
    privateKey: privateKeyJwk,
    publicKey: publicKeyJwk,
  };

  window.localStorage.setItem(KEYPAIR_STORAGE_KEY, JSON.stringify(toStore));

  return {
    privateKey: keypair.privateKey,
    publicKey: keypair.publicKey,
  };
}

// Export public key as JWK string for database storage
export async function exportPublicKeyJwk(
  publicKey: CryptoKey,
): Promise<string> {
  const jwk = await crypto.subtle.exportKey("jwk", publicKey);
  return JSON.stringify(jwk);
}

// Import public key from JWK string
export async function importPublicKeyJwk(jwkString: string): Promise<CryptoKey> {
  const jwk = JSON.parse(jwkString);
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: ALGORITHM, namedCurve: NAMED_CURVE },
    false,
    [],
  );
}

// Derive a shared encryption key for a conversation
export async function deriveSharedKey(
  privateKey: CryptoKey,
  theirPublicKeyJwk: string,
): Promise<CryptoKey> {
  const theirPublicKey = await importPublicKeyJwk(theirPublicKeyJwk);

  // Derive shared secret via ECDH
  const sharedSecret = await crypto.subtle.deriveBits(
    {
      name: ALGORITHM,
      public: theirPublicKey,
    },
    privateKey,
    256, // 256 bits for SHA-256
  );

  // Expand via HKDF to get AES key
  const hkdfKey = await crypto.subtle.importKey(
    "raw",
    sharedSecret,
    { name: "HKDF" },
    false,
    ["deriveBits"],
  );

  const aesKeyBits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: HASH,
      salt: new Uint8Array(0),
      info: new TextEncoder().encode("campusstall-e2ee"),
    },
    hkdfKey,
    AES_KEY_LENGTH,
  );

  return crypto.subtle.importKey(
    "raw",
    aesKeyBits,
    { name: AES_ALGORITHM },
    false,
    ["encrypt", "decrypt"],
  );
}

// Encrypt a text message
export async function encryptText(
  message: string,
  sharedKey: CryptoKey,
): Promise<{ ciphertext: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
  const plaintext = new TextEncoder().encode(message);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: AES_ALGORITHM,
      iv,
    },
    sharedKey,
    plaintext,
  );

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

// Decrypt a text message
export async function decryptText(
  ciphertext: string,
  iv: string,
  sharedKey: CryptoKey,
): Promise<string> {
  try {
    const ciphertextBytes = Uint8Array.from(atob(ciphertext), (c) =>
      c.charCodeAt(0),
    );
    const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

    const plaintext = await crypto.subtle.decrypt(
      {
        name: AES_ALGORITHM,
        iv: ivBytes,
      },
      sharedKey,
      ciphertextBytes,
    );

    return new TextDecoder().decode(plaintext);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt message");
  }
}

// Encrypt binary data (for images)
export async function encryptBinary(
  data: ArrayBuffer,
  sharedKey: CryptoKey,
): Promise<{ ciphertext: ArrayBuffer; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: AES_ALGORITHM,
      iv,
    },
    sharedKey,
    data,
  );

  return {
    ciphertext: encrypted,
    iv: btoa(String.fromCharCode(...iv)),
  };
}

// Decrypt binary data (for images)
export async function decryptBinary(
  ciphertext: ArrayBuffer,
  iv: string,
  sharedKey: CryptoKey,
): Promise<ArrayBuffer> {
  try {
    const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

    return await crypto.subtle.decrypt(
      {
        name: AES_ALGORITHM,
        iv: ivBytes,
      },
      sharedKey,
      ciphertext,
    );
  } catch (error) {
    console.error("Binary decryption failed:", error);
    throw new Error("Failed to decrypt attachment");
  }
}
