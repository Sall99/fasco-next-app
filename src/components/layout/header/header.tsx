"use client";

import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button, Typography } from "@/components";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  CartItem,
  decreaseQuantity,
  selectCartItems,
  selectTotalPrice,
  updateQuantity,
} from "@/store/slices/cart";
import Image from "next/image";

const Links = [
  { title: "Home", path: "/" },
  { title: "Shop", path: "/shop" },
  { title: "Log in", path: "/auth/login" },
];

interface CartItemActions {
  handleUpdateQuantity: (productId: string, quantity: number) => void;
  handleDecreaseQuantity: (productId: string) => void;
}

const Items = ({
  item,
  actions,
}: {
  item: CartItem;
  actions: CartItemActions;
}) => (
  <div className="flex items-center gap-4">
    <div className="relative h-16 w-16 flex-shrink-0">
      <Image src={item.image} alt={item.name} fill className="object-cover" />
    </div>
    <div className="flex-1">
      <Typography variant="p-12">{item.name}</Typography>
      <Typography variant="p-12" className="font-semibold">
        ${item.price.toFixed(2)}
      </Typography>
    </div>
    <div className="flex items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="rounded-full bg-gray-100 p-2"
        onClick={() => actions.handleDecreaseQuantity(item.productId)}
      >
        <Minus size={16} />
      </motion.button>
      <Typography variant="p-12">{item.quantity}</Typography>
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="rounded-full bg-gray-100 p-2"
        onClick={() =>
          actions.handleUpdateQuantity(item.productId, item.quantity + 1)
        }
      >
        <Plus size={16} />
      </motion.button>
    </div>
  </div>
);

const CartModal = ({
  cartItems,
  cartTotalPrice,
  toggleCart,
  actions,
}: {
  cartItems: CartItem[];
  cartTotalPrice: number;
  toggleCart: () => void;
  actions: CartItemActions;
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={{
      hidden: { opacity: 0, x: "100%" },
      visible: { opacity: 1, x: 0 },
    }}
    className="fixed right-0 top-0 z-[80] h-screen w-full bg-white px-6 pt-20 md:w-96"
  >
    <div className="flex items-center justify-between pb-6">
      <Typography variant="h4">Your Cart</Typography>
      <motion.button
        onClick={toggleCart}
        whileTap={{ scale: 0.9 }}
        className="rounded-full p-2 hover:bg-gray-100"
      >
        <X size={24} />
      </motion.button>
    </div>

    {cartItems.length === 0 ? (
      <EmptyCart toggleCart={toggleCart} />
    ) : (
      <CartContent
        cartItems={cartItems}
        cartTotalPrice={cartTotalPrice}
        actions={actions}
      />
    )}
  </motion.div>
);

const EmptyCart = ({ toggleCart }: { toggleCart: () => void }) => (
  <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center">
    <ShoppingCart size={48} className="mb-4 text-gray-400" />
    <Typography variant="h6" className="text-gray-500">
      Your cart is empty
    </Typography>
    <Typography variant="p-12" className="mb-4 text-gray-400">
      Add some items to get started
    </Typography>
    <Button onClick={toggleCart}>Continue Shopping</Button>
  </div>
);

const CartContent = ({
  cartItems,
  cartTotalPrice,
  actions,
}: {
  cartItems: CartItem[];
  cartTotalPrice: number;
  actions: CartItemActions;
}) => (
  <div className="flex h-[calc(100vh-200px)] flex-col justify-between">
    <div className="flex-1 space-y-4 overflow-y-auto">
      {cartItems.map((item, key) => (
        <Items key={key} item={item} actions={actions} />
      ))}
    </div>
    <CartTotal cartTotalPrice={cartTotalPrice} />
  </div>
);

const CartTotal = ({ cartTotalPrice }: { cartTotalPrice: number }) => (
  <div className="border-t border-gray-200 py-4">
    <div className="mb-4 flex justify-between">
      <Typography variant="p-12">Subtotal</Typography>
      <Typography variant="p-12" className="font-semibold">
        ${cartTotalPrice.toFixed(2)}
      </Typography>
    </div>
    <Button className="w-full">Checkout</Button>
  </div>
);

const NavLink = ({
  path,
  title,
  onClick,
  className = "",
}: {
  path: string;
  title: string;
  onClick?: () => void;
  className?: string;
}) => (
  <motion.li variants={linkVariants} whileHover="hover">
    <Link
      href={path}
      onClick={onClick}
      className={`text-gray-700 transition-colors hover:text-primary-600 ${className}`}
    >
      {title}
    </Link>
  </motion.li>
);

const MobileMenu = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        key="mobile-menu"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={mobileMenuVariants}
        className="fixed left-0 top-0 z-[75] h-screen w-full bg-white px-6 pt-20 lg:hidden"
      >
        <div className="flex flex-col gap-6">
          {Links.map(({ title, path }, key) => (
            <motion.div key={key} variants={linkVariants} onClick={toggle}>
              <NavLink
                path={path}
                title={title}
                className="block py-2 text-xl"
              />
            </motion.div>
          ))}
          <motion.div variants={linkVariants} onClick={toggle}>
            <Link href="/auth/signup">
              <Button className="w-full">Sign up</Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const CartIcon = ({ itemCount }: { itemCount: number }) => (
  <motion.button
    whileHover="hover"
    variants={linkVariants}
    className="relative"
  >
    <ShoppingCart className="h-6 w-6 text-gray-700" />
    {itemCount > 0 && (
      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
        {itemCount}
      </span>
    )}
  </motion.button>
);

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: {
    scale: 1.05,
    color: "var(--primary-600)",
    transition: { duration: 0.2 },
  },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: { opacity: 1, x: 0 },
};

const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

export const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const cartTotalPrice = useSelector(selectTotalPrice);

  const cartActions = {
    handleUpdateQuantity: (productId: string, quantity: number) => {
      dispatch(updateQuantity({ productId, quantity }));
    },
    handleDecreaseQuantity: (productId: string) => {
      dispatch(decreaseQuantity({ productId, quantity: 1 }));
    },
  };

  const shouldRenderHeader = useMemo(() => {
    const authRoutes = new Set([
      "/auth/reset-password",
      "/auth/confirm-code",
      "/auth/forgot-password",
      "/auth/login",
      "/auth/signup",
    ]);
    return !authRoutes.has(pathname);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isCartOpen) setIsCartOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  if (!shouldRenderHeader) return null;

  return (
    <>
      <motion.header
        className="relative mt-10 px-6 lg:mt-20"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <div className="m-auto flex max-w-7xl items-center justify-between px-4 lg:px-0">
          <motion.div variants={linkVariants} whileHover={{ scale: 1.1 }}>
            <Link href="/">
              <Typography variant="h2" font="primary">
                FASCO
              </Typography>
            </Link>
          </motion.div>

          <DesktopNavigation toggleCart={toggleCart} cartItems={cartItems} />

          <MobileNavigation
            toggleCart={toggleCart}
            cartItems={cartItems}
            toggleMobileMenu={toggleMobileMenu}
            isMobileMenuOpen={isMobileMenuOpen}
          />
        </div>

        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[75] bg-black"
                onClick={toggleCart}
              />
              <CartModal
                cartItems={cartItems}
                cartTotalPrice={cartTotalPrice}
                toggleCart={toggleCart}
                actions={cartActions}
              />
            </>
          )}
        </AnimatePresence>
      </motion.header>

      <MobileMenu isOpen={isMobileMenuOpen} toggle={toggleMobileMenu} />
    </>
  );
};

const DesktopNavigation = ({
  toggleCart,
  cartItems,
}: {
  toggleCart: () => void;
  cartItems: CartItem[];
}) => (
  <div className="hidden items-center gap-5 lg:flex">
    <motion.ul className="flex items-center gap-5" variants={headerVariants}>
      {Links.map(({ title, path }, key) => (
        <NavLink key={key} path={path} title={title} />
      ))}
    </motion.ul>
    <motion.div
      variants={linkVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-4"
    >
      <button onClick={toggleCart}>
        <CartIcon itemCount={cartItems.length} />
      </button>
      <Link href="/auth/signup">
        <Button>Sign up</Button>
      </Link>
    </motion.div>
  </div>
);

const MobileNavigation = ({
  toggleCart,
  cartItems,
  toggleMobileMenu,
  isMobileMenuOpen,
}: {
  toggleCart: () => void;
  cartItems: CartItem[];
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}) => (
  <div className="flex items-center gap-4 lg:hidden">
    <motion.button
      onClick={toggleCart}
      whileTap={{ scale: 0.9 }}
      className="relative z-50"
    >
      <CartIcon itemCount={cartItems.length} />
    </motion.button>
    <MenuToggleButton isOpen={isMobileMenuOpen} toggle={toggleMobileMenu} />
  </div>
);

const MenuToggleButton = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) => (
  <motion.button
    onClick={toggle}
    whileTap={{ scale: 0.9 }}
    className="relative z-50"
  >
    {isOpen ? <X size={24} /> : <Menu size={24} />}
  </motion.button>
);
