// Type definitions for next/navigation
declare module "next/navigation" {
  export interface NavigateOptions {
    scroll?: boolean;
  }

  export function useRouter(): {
    back(): void;
    forward(): void;
    refresh(): void;
    push(href: string, options?: NavigateOptions): void;
    replace(href: string, options?: NavigateOptions): void;
    prefetch(href: string): void;
  };

  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
}
