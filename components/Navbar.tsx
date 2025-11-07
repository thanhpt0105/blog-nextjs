'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { 
  Dashboard, 
  Logout, 
  Login, 
  Menu as MenuIcon,
  Home as HomeIcon,
  Label as TagIcon,
  Info as AboutIcon,
  AccountCircle,
} from '@mui/icons-material';
import Link from 'next/link';
import PageLink from './PageLink';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggleButton } from './ThemeToggleButton';

interface NavbarProps {
  siteName?: string;
}

export function Navbar({ siteName = 'My Blog' }: NavbarProps) {
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSignOut = async () => {
    handleClose();
    setMobileOpen(false);
    await signOut({ callbackUrl: '/' });
  };

  const navigationItems = [
    { text: 'Home', href: '/', icon: <HomeIcon /> },
    { text: 'Tags', href: '/tags', icon: <TagIcon /> },
    { text: 'About', href: '/about', icon: <AboutIcon /> },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {siteName}
        </Typography>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={handleDrawerToggle}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {session ? (
        <List>
          <ListItem>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Avatar 
                sx={{ width: 32, height: 32 }}
                src={session.user.image || undefined}
                alt={session.user.name || session.user.email || 'User'}
              >
                {!session.user.image && (session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap>
                  {session.user.name || session.user.email}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {session.user.email}
                </Typography>
              </Box>
            </Box>
          </ListItem>
          {(session.user.role === 'ADMIN' || session.user.role === 'EDITOR') && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/admin"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <Dashboard fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Admin Panel" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/admin/profile"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="My Profile" />
                </ListItemButton>
              </ListItem>
            </>
          )}
          <ListItem disablePadding>
            <ListItemButton onClick={handleSignOut}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/login"
              onClick={handleDrawerToggle}
            >
              <ListItemIcon>
                <Login fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Link href="/" passHref legacyBehavior>
              <Typography
                variant="h6"
                component="a"
                sx={{
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                {siteName}
              </Typography>
            </Link>

            {/* Desktop navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Link href="/" passHref legacyBehavior>
                  <Button color="inherit" component="a">
                    Home
                  </Button>
                </Link>
                <Link href="/tags" passHref legacyBehavior>
                  <Button color="inherit" component="a">
                    Tags
                  </Button>
                </Link>
                <Link href="/about" passHref legacyBehavior>
                  <Button color="inherit" component="a">
                    About
                  </Button>
                </Link>
                <ThemeToggleButton />

                {session ? (
                  <>
                    <IconButton
                      onClick={handleMenu}
                      size="small"
                      sx={{ ml: 1 }}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <Avatar 
                        sx={{ width: 32, height: 32 }}
                        src={session.user.image || undefined}
                        alt={session.user.name || session.user.email || 'User'}
                      >
                        {!session.user.image && (session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem disabled>
                        <Typography variant="body2" color="text.secondary">
                          {session.user.email}
                        </Typography>
                      </MenuItem>
                      <Divider />
                      {(session.user.role === 'ADMIN' || session.user.role === 'EDITOR') && (
                        <>
                          <MenuItem component={Link} href="/admin">
                            <ListItemIcon>
                              <Dashboard fontSize="small" />
                            </ListItemIcon>
                            Admin Panel
                          </MenuItem>
                          <MenuItem component={Link} href="/admin/profile">
                            <ListItemIcon>
                              <AccountCircle fontSize="small" />
                            </ListItemIcon>
                            My Profile
                          </MenuItem>
                        </>
                      )}
                      <MenuItem onClick={handleSignOut}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button
                    color="inherit"
                    component={Link}
                    href="/login"
                    startIcon={<Login />}
                  >
                    Login
                  </Button>
                )}
              </Box>
            )}

            {/* Mobile theme toggle and avatar */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ThemeToggleButton />
                {session && (
                  <Avatar 
                    sx={{ width: 32, height: 32 }}
                    src={session.user.image || undefined}
                    alt={session.user.name || session.user.email || 'User'}
                  >
                    {!session.user.image && (session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
