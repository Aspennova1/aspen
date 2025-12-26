
import LinksDropdown from './LinksDropdown';
// import { UserButton } from '@clerk/nextjs';
import {ModeToggle} from './ThemeToggle';
import {NavbarUser} from './NavbarUser';

function Navbar() {
  return (
    <nav className='bg-muted py-4 sm:px-16 lg:px-24 px-4 flex items-center justify-between'>
      <div>
        <LinksDropdown />
      </div>
      <div className='flex items-center gap-x-4'>
        <NavbarUser/>
        {/* <LoginModal /> */}
        <ModeToggle />
      </div>
    </nav>
  );
}
export default Navbar;