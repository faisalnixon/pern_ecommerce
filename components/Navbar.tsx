"use client";
import { PackageIcon, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useState, useCallback, useRef } from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";
import { useAppSelector } from "../lib/hooks";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const router = useRouter();

  const [search, setSearch] = useState("");
  const cartCount = useAppSelector((state) => state.cart.total);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live search: fires on every keystroke with a small debounce (300ms)
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        if (value.trim()) {
          router.push(`/shop?search=${encodeURIComponent(value.trim())}`);
        } else {
          router.push("/shop");
        }
      }, 300);
    },
    [router],
  );

  // Keep form submit as a fallback (Enter key)
  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/shop");
    }
  };



  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowSearch(true);
      } else {
        setShowSearch(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        {/* <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all"> */}
        <div className="flex flex-col sm:flex-row sm:items-center  max-w-7xl mx-auto py-4 gap-3 ">
          <div className="flex flex-2 justify-between gap-4">
            <Link
              href="/"
              className="relative text-[18px] sm:text-[25px] lg:text-[32px] font-semibold text-slate-700 mr-2"
            >
              <span className="text-green-600">pern</span>ecommerce
              <span className="text-green-600 text-[1.2em] leading-none">
                .
              </span>
              <Protect plan="plus">
                <p className="absolute text-[10px] sm:text-xs -top-1 -right-6 sm:-right-8 px-2 sm:px-3 py-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                  plus
                </p>
              </Protect>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
              <Link href="/shop">Shop</Link>
              <Link href="/">About</Link>
              <Link href="/">Contact</Link>

              {!user ? (
                <button
                  onClick={() => openSignIn()}
                  className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
                >
                  Login
                </button>
              ) : (
                <div className="flex flex-row gap-3">
                  <Link
                    href="/cart"
                    className="relative flex items-center gap-2 text-slate-600"
                  >
                    <ShoppingCart size={18} />
                    Cart
                    <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">
                      {cartCount}
                    </button>
                  </Link>

                  <UserButton>
                    <UserButton.MenuItems>
                      <UserButton.Action
                        labelIcon={<PackageIcon size={16} />}
                        label="My Orders"
                        onClick={() => router.push("/orders")}
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              )}
            </div>

            {/* Mobile User Button */}
            <div className="sm:hidden">
              {user ? (
                <div className="flex flex-row gap-3">
                  <Link
                    href="/cart"
                    className="relative flex items-center gap-2 text-slate-600"
                  >
                    <ShoppingCart size={18} />
                    <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">
                      {cartCount}
                    </button>
                  </Link>

                  <UserButton>
                    <UserButton.MenuItems>
                      <UserButton.Action
                        labelIcon={<PackageIcon size={16} />}
                        label="My Orders"
                        onClick={() => router.push("/orders")}
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                  {/* <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      labelIcon={<ShoppingCart size={16} />}
                      label="Cart"
                      onClick={() => router.push("/cart")}
                    />
                  </UserButton.MenuItems>
                </UserButton>{" "} */}
                </div>
              ) : (
                <button
                  onClick={() => openSignIn()}
                  className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          
          {/* <form
            onSubmit={handleSearch}
            className="flex flex-1 items-center w-full sm:w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full "
          > */}
          <form
            onSubmit={handleSearch}
            className={`fixed left-0 bottom-0 w-full sm:static sm:w-xs flex items-center text-sm gap-2 bg-slate-100 px-4 py-3 rounded-none sm:rounded-full transition-all duration-300 z-50  shadow-lg
            ${
              showSearch
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0 sm:translate-y-0 sm:opacity-100"
            }`}
          >
            <Search size={18} className="text-slate-600" />
            <input
              className="w-full bg-transparent outline-none placeholder-slate-600"
              type="text"
              placeholder="Search by name, store or category"
              value={search}
              onChange={handleSearchChange}
            />
          </form>
        </div>
      </div>
      <hr className="border-gray-300" />
    </nav>
  );
};

export default Navbar;


