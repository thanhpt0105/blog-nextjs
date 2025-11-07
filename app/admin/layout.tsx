'use client';

import { ReactNode, useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Article,
  People,
  Settings,
  Link as LinkIcon,
  Logout,
  AccountCircle,
  Label,
  Public,
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const drawerWidth = 260;

const allMenuItems = [
  { text: 'Dashboard', icon: <Dashboard />, href: '/admin', roles: ['ADMIN', 'EDITOR'] },
  { text: 'Blog Posts', icon: <Article />, href: '/admin/posts', roles: ['ADMIN', 'EDITOR'] },
  { text: 'Tags', icon: <Label />, href: '/admin/tags', roles: ['ADMIN', 'EDITOR'] },
  { text: 'Users', icon: <People />, href: '/admin/users', roles: ['ADMIN'] },
  { text: 'My Profile', icon: <AccountCircle />, href: '/admin/profile', roles: ['ADMIN', 'EDITOR'] },
  { text: 'Settings', icon: <Settings />, href: '/admin/settings', roles: ['ADMIN'] },
  { text: 'Social Links', icon: <LinkIcon />, href: '/admin/social-links', roles: ['ADMIN'] },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const userRole = session?.user?.role || 'USER';
  
  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => 
    item.roles.includes(userRole as 'ADMIN' | 'EDITOR')
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    handleClose();
    setMobileOpen(false);
    await signOut({ callbackUrl: '/login' });
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      
      {/* User info section for mobile */}
      {session?.user && (
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <List>
            <ListItem>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Avatar 
                  sx={{ width: 40, height: 40 }}
                  src={session.user.image || undefined}
                  alt={session.user.name || session.user.email || 'User'}
                >
                  {!session.user.image && (session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {session.user.name || session.user.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {session.user.email}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          </List>
          <Divider />
        </Box>
      )}
      
      <List>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                onClick={() => setMobileOpen(false)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      {/* User actions for mobile */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/"
              onClick={() => setMobileOpen(false)}
            >
              <ListItemIcon>
                <Public fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="View Site" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleSignOut}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            {menuItems.find((item) => item.href === pathname)?.text || 'Admin'}
          </Typography>

          {session?.user && (
            <>
              <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center' }}>
                <Avatar 
                  src={session.user.image || undefined} 
                  alt={session.user.name || session.user.email || 'User'}
                  sx={{ width: 32, height: 32 }}
                >
                  {!session.user.image && (session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
                <Chip
                  label={session.user.role}
                  size="small"
                  color={session.user.role === 'ADMIN' ? 'error' : session.user.role === 'EDITOR' ? 'primary' : 'default'}
                />
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ p: 1 }}
                >
                  <Avatar 
                    src={session.user.image || undefined} 
                    alt={session.user.name || session.user.email || 'User'}
                    sx={{ width: 32, height: 32 }}
                  >
                    {!session.user.image && (session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Box>
            </>
          )}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {session?.user?.email}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem component={Link} href="/admin/profile" onClick={handleClose}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem component={Link} href="/" onClick={handleClose}>
              <ListItemIcon>
                <Public fontSize="small" />
              </ListItemIcon>
              View Site
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
