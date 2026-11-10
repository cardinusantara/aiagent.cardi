import React, { useState, useEffect } from "react";

export function Link({
  href,
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
}

export default Link;

export function usePathname(): string {
  const [pathname, setPathname] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
    }
  }, []);

  return pathname;
}

export function useSearchParams(): URLSearchParams {
  const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());

  useEffect(() => {
    if (typeof window !== "undefined") {
      setParams(new URLSearchParams(window.location.search));
    }
  }, []);

  return params;
}

export function useRouter() {
  return {
    push: (url: string) => {
      if (typeof window !== "undefined") {
        window.location.href = url;
      }
    },
    replace: (url: string) => {
      if (typeof window !== "undefined") {
        window.location.replace(url);
      }
    },
    back: () => {
      if (typeof window !== "undefined") {
        window.history.back();
      }
    },
    forward: () => {
      if (typeof window !== "undefined") {
        window.history.forward();
      }
    },
    refresh: () => {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    },
  };
}
