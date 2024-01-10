import { useCallback } from "react";
import { useAtom, atom, useAtomValue } from "jotai";

async function generateKey(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );
}

const keyPairAtom = atom<Promise<CryptoKeyPair>>(generateKey());

const publicKeyStores = atom<Map<string, CryptoKey>>(new Map());

function concatBuffer(segments: ArrayBuffer[]) {
  let sumLength = 0;
  for (let i = 0; i < segments.length; ++i) {
    sumLength += segments[i].byteLength;
  }
  const whole = new Uint8Array(sumLength);
  let pos = 0;
  for (let i = 0; i < segments.length; ++i) {
    whole.set(new Uint8Array(segments[i]), pos);
    pos += segments[i].byteLength;
  }
  return whole.buffer;
}

export const useCrypto = () => {
  const keyPair = useAtomValue(keyPairAtom);
  const encrypt = useCallback(async (message: string, publicKey: CryptoKey) => {
    const encoded = new TextEncoder().encode(message);
    const array = [];
    const chunkSize = 190;
    for (let i = 0; i < encoded.length; i += chunkSize) {
      array.push(encoded.slice(i, i + chunkSize));
    }
    const result = [];
    for (const chunk of array) {
      result.push(
        await window.crypto.subtle.encrypt(
          {
            name: "RSA-OAEP",
          },
          publicKey,
          chunk,
        ),
      );
    }
    return result;
  }, []);
  const decrypt = useCallback(
    async (message: ArrayBuffer[], privateKey: CryptoKey) => {
      const segments: ArrayBuffer[] = [];
      for (const chunk of message) {
        const decoded = await window.crypto.subtle.decrypt(
          {
            name: "RSA-OAEP",
          },
          privateKey,
          chunk,
        );
        segments.push(decoded);
      }
      return new TextDecoder().decode(concatBuffer(segments));
    },
    [],
  );

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    encrypt,
    decrypt,
  };
};

export const usePublicKeyStore = () => {
  const [publicKeyStore, setPublicKeyStore] = useAtom(publicKeyStores);

  const addPublicKey = useCallback(
    (id: string, publicKey: CryptoKey) => {
      setPublicKeyStore((old) => {
        if (old.has(id)) {
          return old;
        }
        const newMap = new Map(old);
        newMap.set(id, publicKey);
        return newMap;
      });
    },
    [setPublicKeyStore],
  );

  const getPublicKey = useCallback(
    (id: string) => {
      return publicKeyStore.get(id);
    },
    [publicKeyStore],
  );

  return { addPublicKey, getPublicKey, publicKeyStore };
};
