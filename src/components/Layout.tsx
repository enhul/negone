import { useMember } from '@/integrations';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Home, User, BarChart3, BookOpen, Utensils, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Нүүр', href: '/', icon: Home },
    { name: 'Хяналтын самбар', href: '/dashboard', icon: BarChart3, protected: true },
    { name: 'Жорууд', href: '/recipes', icon: Utensils },
    { name: 'Ахиц дэвшил', href: '/progress', icon: BookOpen, protected: true },
    { name: 'NegOne-ийн тухай', href: '/about', icon: User },
  ];

  const filteredNavigation = navigation.filter(item => 
    !item.protected || (item.protected && isAuthenticated)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-md shadow-lg border-b border-primary/10 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.div 
                className="text-2xl font-heading text-primary"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                NegOne
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-paragraph transition-colors ${
                      isActive
                        ? 'bg-primary/20 text-primary'
                        : 'text-foreground/70 hover:text-primary hover:bg-primary/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoading && <LoadingSpinner />}
              {!isAuthenticated && !isLoading && (
                <Button 
                  onClick={actions.login}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-[20px] px-6 py-2 font-paragraph"
                >
                  Нэвтрэх
                </Button>
              )}
              {isAuthenticated && (
                <div className="flex items-center space-x-4">
                  <Link to="/profile">
                    <Button 
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10 rounded-[20px] px-4 py-2 font-paragraph"
                    >
                      {member?.profile?.nickname || member?.contact?.firstName || 'Профайл'}
                    </Button>
                  </Link>
                  <Button 
                    onClick={actions.logout}
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary/10 rounded-[20px] px-4 py-2 font-paragraph"
                  >
                    Гарах
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden py-4 border-t border-primary/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col space-y-2">
                {filteredNavigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-paragraph transition-colors ${
                        isActive
                          ? 'bg-primary/20 text-primary'
                          : 'text-foreground/70 hover:text-primary hover:bg-primary/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
                
                {/* Mobile Auth */}
                <div className="pt-4 border-t border-primary/10 space-y-2">
                  {isLoading && (
                    <div className="flex justify-center py-2">
                      <LoadingSpinner />
                    </div>
                  )}
                  {!isAuthenticated && !isLoading && (
                    <Button 
                      onClick={() => {
                        actions.login();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-[20px] py-3 font-paragraph"
                    >
                      Нэвтрэх
                    </Button>
                  )}
                  {isAuthenticated && (
                    <div className="space-y-2">
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          variant="outline"
                          className="w-full border-primary text-primary hover:bg-primary/10 rounded-[20px] py-3 font-paragraph"
                        >
                          {member?.profile?.nickname || member?.contact?.firstName || 'Профайл'}
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => {
                          actions.logout();
                          setMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-secondary text-secondary hover:bg-secondary/10 rounded-[20px] py-3 font-paragraph"
                      >
                        Гарах
                      </Button>
                    </div>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <motion.footer 
        className="bg-gradient-to-br from-primary/5 to-secondary/5 border-t border-primary/10 py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-heading text-primary mb-4">NegOne</h3>
              <p className="text-foreground/80 font-paragraph">
                Эмэгтэйчүүдийн эрүүл мэнд, сэтгэлзүй, өөрийгөө хайрлахад зориулсан AI платформ
              </p>
            </div>
            <div>
              <h4 className="text-lg font-heading text-foreground mb-4">Холбоосууд</h4>
              <nav className="space-y-2">
                {filteredNavigation.slice(0, 4).map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-foreground/70 hover:text-primary transition-colors font-paragraph"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <h4 className="text-lg font-heading text-foreground mb-4">Холбоо барих</h4>
              <p className="text-foreground/80 font-paragraph">
                Асуулт, санал хүсэлт байвал бидэнтэй холбогдоорой
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary/10 text-center">
            <p className="text-foreground/60 font-paragraph">
              © 2024 NegOne. Бүх эрх хуулиар хамгаалагдсан.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}