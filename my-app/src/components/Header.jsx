import React, { useEffect, useState } from 'react'
import Headroom from 'react-headroom'
import { Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Link,
  useNavigate
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'


function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const user = useSelector(state => state.Authproject)
  console.log(user)
  const toggleSidebar = () => setIsOpen(!isOpen)
  const navigate = useNavigate()
  function handleLogout() {
    fetch("https://vtu-network.onrender.com/api/user/logout", {
      method: "GET",
      credentials: "include", // ⬅️ Needed to send cookies!
    })
      .then((res) => {
        if (res.ok) {
          window.location.reload()
          navigate("/login");
        } else {
          console.log("Logout failed");
        }
      })
      .catch((err) => {
        console.error("Error during logout:", err);
      });
  }




  return (
    <Headroom>
      <header className=" bg-gray-900 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="bg-white flex md:hidden mr-4">
                    <Menu className="h-6  w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6">
                    <ul className="space-y-4">
                      <li><a href="#" className="text-lg hover:underline">Home</a></li>
                      <li><a href="/notes" className="text-lg hover:underline">Notes </a></li>
                      <li><a href="#" className="text-lg hover:underline">Previous Papers</a></li>
                      <li><a href="#" className="text-lg hover:underline">Contact</a></li>
                    </ul>
                  </nav>
                </SheetContent>
              </Sheet>
              <div onClick={() => navigate('/')} className='flex items-center  cursor-pointer gap-3'>
                <img src="/enchancedimage.png" className='w-[45px] h-[45px]' alt="" />
                <h1 className="text-xl text-white font-bold">Vtu Network</h1>
              </div>
            </div>
            <div className='text-white text-[20px] hidden md:flex  m-auto    gap-3'>
              <h2 ><a href="/">   Home </a></h2>
              <h2> <a href="/notes">Notes</a> </h2>
              <h2> <a href='/papers'>   Previous Papers </a> </h2>

            </div>
            <div className="ml-[120px] flex items-center space-x-4">
              {user?.isAuthenticated ? <DropdownMenu>

                <DropdownMenuTrigger asChild>

                  <Avatar className='cursor-pointer'>
                    <AvatarImage className='bg-black' />
                    <AvatarFallback className={'bg-black font-serif text-2xl text-white'}>{user.user ? user.user.username[0].toUpperCase() : user?.userName[0]?.toUpperCase()}</AvatarFallback>

                  </Avatar>

                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 relative bg-gray-800 text-white left-[-50px]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>

                  </DropdownMenuGroup>


                  <DropdownMenuItem onClick={handleLogout}>
                    Log out

                  </DropdownMenuItem>
                </DropdownMenuContent>




              </DropdownMenu>



                : <Button variant="outline" onClick={() => { navigate('/Login') }}>Login</Button>}
            </div>
          </div>
        </div>
      </header>
    </Headroom>
  )
}
export default Header;