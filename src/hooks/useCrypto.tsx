import { useEffect, useCallback } from "react";
import { useAtom, atom } from "jotai";

async function generateKey(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );
}

const publicKeyAtom = atom<CryptoKey | undefined>(undefined);
const privateKeyAtom = atom<CryptoKey | undefined>(undefined);

const publicKeyStores = atom<Map<string, CryptoKey>>(new Map());

export const useCrypto = () => {
  const [publicKey, setPublicKey] = useAtom(publicKeyAtom);
  const [privateKey, setPrivateKey] = useAtom(privateKeyAtom);
  const encrypt = useCallback(async (message: string, publicKey: CryptoKey) => {
    const encoded = new TextEncoder().encode(message);
    console.log(encoded, publicKey);
    return await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      encoded,
    );
  }, []);
  const decrypt = useCallback(
    async (message: ArrayBuffer, privateKey: CryptoKey) => {
      const decoded = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        privateKey,
        message,
      );
      return new TextDecoder().decode(decoded);
    },
    [],
  );

  useEffect(() => {
    if (publicKey !== undefined && privateKey !== undefined) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const keyPair = await generateKey();
      setPublicKey(keyPair.publicKey);
      setPrivateKey(keyPair.privateKey);
    })();
  }, [setPublicKey, setPrivateKey, publicKey, privateKey]);

  return { publicKey, privateKey, encrypt, decrypt };
};

export const usePublicKeyStore = () => {
  const [publicKeyStore, setPublicKeyStore] = useAtom(publicKeyStores);

  const addPublicKey = useCallback(
    (id: string, publicKey: CryptoKey) => {
      setPublicKeyStore((old) => {
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
