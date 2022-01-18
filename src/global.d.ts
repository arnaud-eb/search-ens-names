interface Window {
  ethereum: {
    request: (arg: { method: string }) => Promise<void>;
  };
}

declare module "@ensdomains/ui/src/utils/index" {
  export const validateName: (name: string) => void;
  export const parseSearchTerm: (term: string, validTLD: boolean) => string;
}
