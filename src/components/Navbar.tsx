'use client';

import Image from 'next/image';
import Link from 'next/link';

// Define a type for the user prop
interface User {
  name?: string | null;
}

interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const userName = user?.name || 'John Doe'; // Use a fallback name
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`;

  return (
    <nav className="navbar bg-base-100 max-sm:rounded-box max-sm:shadow-sm sm:border-b border-base-content/25 sm:z-1 relative">
      <button
        type="button"
        className="btn btn-text max-sm:btn-square sm:hidden me-2"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="with-navbar-sidebar"
        data-overlay="#with-navbar-sidebar"
      >
        <span className="icon-[tabler--menu-2] size-5"></span>
      </button>
      <div className="flex flex-1 items-center">
        <Link className="link text-base-content link-neutral text-xl font-semibold no-underline" href="/superadmin/page">
          FitnessPro
        </Link>
      </div>
      <div className="navbar-end flex items-center gap-4">
        {/* <div className="dropdown relative inline-flex [--auto-close:inside] [--offset:8] [--placement:bottom-end]">
          <button
            id="dropdown-scrollable"
            type="button"
            className="dropdown-toggle btn btn-text btn-circle dropdown-open:bg-base-content/10 size-10"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label="Dropdown"
          >
            <div className="indicator">
              <span className="indicator-item bg-error size-2 rounded-full"></span>
              <span className="icon-[tabler--bell] text-base-content size-5.5"></span>
            </div>
          </button>
          <div
            className="dropdown-menu dropdown-open:opacity-100 hidden"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdown-scrollable"
          >
            <div className="dropdown-header justify-center">
              <h6 className="text-base-content text-base">Notifications</h6>
            </div>
            <div className="overflow-y-auto overflow-x-auto text-base-content/80 max-h-56 overflow-auto max-md:max-w-60">
              <div className="dropdown-item">
                <div className="avatar avatar-away-bottom">
                  <div className="w-10 rounded-full">
                    <Image src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png" alt="avatar 1" width={40} height={40} />
                  </div>
                </div>
                <div className="w-60">
                  <h6 className="truncate text-base">Charles Franklin</h6>
                  <small className="text-base-content/50 truncate">Accepted your connection</small>
                </div>
              </div>
            </div>
            <Link href="#" className="dropdown-footer justify-center gap-1">
              <span className="icon-[tabler--eye] size-4"></span>
              View all
            </Link>
          </div>
        </div>
        <div className="dropdown relative inline-flex [--auto-close:inside] [--offset:8] [--placement:bottom-end]">
          <button
            id="dropdown-avatar"
            type="button"
            className="dropdown-toggle flex items-center"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label="Dropdown"
          >
            <div className="avatar">
              <div className="size-9.5 rounded-full">
                <Image src={avatarUrl} alt={userName} width={38} height={38} />
              </div>
            </div>
          </button>
          <ul
            className="dropdown-menu dropdown-open:opacity-100 hidden min-w-60"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdown-avatar"
          >
            <li className="dropdown-header gap-2">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <Image src={avatarUrl} alt={userName} width={40} height={40} />
                </div>
              </div>
              <div>
                <h6 className="text-base-content text-base font-semibold">{userName}</h6>
                <small className="text-base-content/50">Super Admin</small>
              </div>
            </li>
            <li><Link className="dropdown-item" href="#"><span className="icon-[tabler--user]"></span>My Profile</Link></li>
            <li><Link className="dropdown-item" href="#"><span className="icon-[tabler--settings]"></span>Settings</Link></li>
            <li className="dropdown-footer gap-2">
              <Link className="btn btn-error btn-soft btn-block" href="#">
                <span className="icon-[tabler--logout]"></span>
                Sign out
              </Link>
            </li>
          </ul>
        </div> */}
      </div>
    </nav>
  );
}