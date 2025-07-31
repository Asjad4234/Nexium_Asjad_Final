import { useRouter } from 'next/router';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { signOut } from 'next-auth/react';

const navigation = [
    { name: 'Home', route: '/Home' },
    { name: 'Create Recipe', route: '/CreateRecipe' },
    { name: 'About', route: '/About' },
]

const userNavigation = [
    { name: 'Your Profile', route: '/Profile' },
    { name: 'Sign out', route: '/auth/signout' },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

interface HeaderProps {
    user: {
        name?: string | null | undefined
        image?: string | null | undefined
        email?: string | null | undefined
    } | undefined
}

function Header({ user }: HeaderProps) {
    const router = useRouter();

    const handleNavigation = (menu: { name: string, route: string }) => {
        if (menu.name === 'Sign out') {
            signOut()
            return
        }
        router.push(menu.route)
    }

    if (!user) return null;
    
    return (
        <div className="fixed top-4 right-4 z-50">
            <Menu as="div" className="relative">
                <MenuButton className="flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <EllipsisVerticalIcon className="w-6 h-6 text-white" />
                </MenuButton>
                
                <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl bg-white/95 backdrop-blur-sm py-2 shadow-2xl ring-1 ring-black/5 focus:outline-none">
                    {/* Main Navigation */}
                    <div className="px-1">
                        {navigation.map((item) => (
                            <MenuItem key={item.name}>
                                {({ focus }) => (
                                    <button
                                        className={classNames(
                                            focus ? 'bg-orange-50 text-orange-700' : 'text-gray-700',
                                            item.route === router.pathname ? 'bg-orange-100 text-orange-700' : '',
                                            'group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                        )}
                                        onClick={() => handleNavigation(item)}
                                    >
                                        {item.name}
                                    </button>
                                )}
                            </MenuItem>
                        ))}
                    </div>
                    
                    {/* Divider */}
                    <div className="my-2 border-t border-gray-200"></div>
                    
                    {/* User Actions */}
                    <div className="px-1">
                        {userNavigation.map((item) => (
                            <MenuItem key={item.name}>
                                {({ focus }) => (
                                    <button
                                        className={classNames(
                                            focus ? 'bg-gray-50 text-gray-900' : 'text-gray-700',
                                            'group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                        )}
                                        onClick={() => handleNavigation(item)}
                                    >
                                        {item.name}
                                    </button>
                                )}
                            </MenuItem>
                        ))}
                    </div>
                </MenuItems>
            </Menu>
        </div>
    )
}

export default Header
