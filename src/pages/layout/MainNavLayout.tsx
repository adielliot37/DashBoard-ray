// MainNavLayout.tsx
import React, { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button , IconButton, Tooltip, Typography } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import classNames from "classnames";
import { RiBookMarkLine, RiFeedbackLine, RiWallet3Line } from "react-icons/ri";
import { GlobalContext } from "../../App";
import Logo from "../../logo.png";
import { MainNavContext, useMainNavState } from "./mainNavContext";

export const MAIN_NAV_HEIGHT = 56;
export const BREADCRUMBS_HEIGHT = 36;

const useStyles = makeStyles((theme) => createStyles({
    nav: {
      position: "fixed",
      width: "100%",
      backgroundColor: "white",
      zIndex: 1000,
    },
}));

export const MainNavLayout = () => {
  const classes = useStyles();
  const mainNavContextState = useMainNavState();

  return (
    <MainNavContext.Provider value={mainNavContextState}>
      <nav className={classes.nav}>
        <MainNavBar />
        <MainNavBreadcrumbs />
      </nav>
      <Main />
    </MainNavContext.Provider>
  );
};

const useMainStyles = makeStyles((theme) => createStyles({
    root: {
      paddingTop: MAIN_NAV_HEIGHT,
    },
    withTallNav: {
      paddingTop: MAIN_NAV_HEIGHT + BREADCRUMBS_HEIGHT + 2,
    },
}));

const Main = () => {
  const classes = useMainStyles();
  const { mainNavPageHierarchy } = useContext(MainNavContext);

  const tallNav = mainNavPageHierarchy.length > 1;

  return (
    <main className={classNames(classes.root, { [classes.withTallNav]: tallNav })}>
      <Outlet />
    </main>
  );
};

const useMainNavBarStyles = makeStyles((theme) => createStyles({
    root: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      height: 56,
      backgroundColor: "white",
      alignItems: "center",
      boxShadow: "0px 1px 0px #D2DCE6",
    },
    logo: {
      display: "flex",
      justifyContent: "center",
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(3),
    },
    navItem: {
      marginRight: theme.spacing(6),
      fontSize: "1rem",
      fontWeight: 500,
      color: "black",
      textDecoration: "none",
    },
    navItemHighlighted: {
      color: "#036DCF",
    },
    flexSpacer: {
      flexGrow: 1,
    },
    actionItemsContainer: {
      marginRight: theme.spacing(2),
    },
    actionItem: {
      color: "#5F6469",
    },
}));

const NAV_ITEMS = [
  { title: "Overview", path: "/overview", id: "overview" },
  { title: "Jobs", path: "/jobs", id: "jobs" },
  { title: "Serve", path: "/serve", id: "serve" },
  { title: "Cluster", path: "/cluster", id: "cluster" },
  { title: "Actors", path: "/actors", id: "actors" },
  { title: "Metrics", path: "/metrics", id: "metrics" },
  { title: "Logs", path: "/logs", id: "logs" },
];

const MainNavBar = () => {
  const classes = useMainNavBarStyles();
  const { mainNavPageHierarchy } = useContext(MainNavContext);
  const rootRouteId = mainNavPageHierarchy[0]?.id;
  const { metricsContextLoaded, grafanaHost } = useContext(GlobalContext);
  const [connectedWalletAddress, setConnectedWalletAddress] = useState(null);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);

  const navItems = NAV_ITEMS.filter(({ id }) => !(id === 'metrics' && (!metricsContextLoaded || grafanaHost === "DISABLED")));

  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect({ onlyIfTrusted: false });
        setConnectedWalletAddress(response.publicKey.toString());
        console.log('Connected with Public Key:', response.publicKey.toString());
      } else {
        alert('Phantom wallet not found. Please install it.');
      }
    } catch (err) {
      console.error('Connection to Phantom Wallet failed', err);
      alert('Connection to Phantom Wallet failed');
    }
  };

  const disconnectWallet = () => {
    setConnectedWalletAddress(null);
  };

  const toggleWalletDialog = () => {
    setWalletDialogOpen(!walletDialogOpen);
  };

  return (
    <div className={classes.root}>
      <Link className={classes.logo} to="/">
        <img width={28} src={Logo} alt="Ray" />
      </Link>
      {navItems.map(({ title, path, id }) => (
        <Typography key={id}>
          <Link className={classNames(classes.navItem, { [classes.navItemHighlighted]: rootRouteId === id })} to={path}>
            {title}
          </Link>
        </Typography>
      ))}
      <div className={classes.flexSpacer}></div>
      <div className={classes.actionItemsContainer}>
        <Tooltip title="Manage Wallet">
          <IconButton onClick={toggleWalletDialog} className={classes.actionItem} size="large">
            <RiWallet3Line />
          </IconButton>
        </Tooltip>
      </div>

      {/* Wallet Management Dialog */}
      <Dialog open={walletDialogOpen} onClose={toggleWalletDialog}>
        <DialogTitle>Wallet Management</DialogTitle>
        <DialogContent>
          {connectedWalletAddress ? (
            <>
              <Typography gutterBottom>
                Connected Address: {connectedWalletAddress}
              </Typography>
              <DialogActions>
                <Button onClick={toggleWalletDialog} color="primary">
                  Close
                </Button>
                <Button onClick={disconnectWallet} color="secondary">
                  Disconnect
                </Button>
              </DialogActions>
            </>
          ) : (
            <>
              <Typography gutterBottom>
                You are not connected to a wallet. Connect now?
              </Typography>
              <DialogActions>
                <Button onClick={toggleWalletDialog} color="primary">
                  Close
                </Button>
                <Button onClick={connectWallet} color="primary">
                  Connect
                </Button>
              </DialogActions>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const useMainNavBreadcrumbsStyles = makeStyles((theme) => createStyles({
    root: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      height: 36,
      marginTop: 1,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      backgroundColor: "white",
      alignItems: "center",
      boxShadow: "0px 1px 0px #D2DCE6",
    },
    breadcrumbItem: {
      fontWeight: 500,
      color: "#8C9196",
      "&:not(:first-child)": {
        marginLeft: theme.spacing(1),
      },
    },
    link: {
      textDecoration: "none",
      color: "#8C9196",
    },
    currentItem: {
      color: "black",
    },
}));

const MainNavBreadcrumbs = () => {
  const classes = useMainNavBreadcrumbsStyles();
  const { mainNavPageHierarchy } = useContext(MainNavContext);

  if (mainNavPageHierarchy.length <= 1) {
    return null;
  }

  let currentPath = "";

  return (
    <div className={classes.root}>
      {mainNavPageHierarchy.map(({ title, id, path }, index) => {
        if (path) {
          if (path.startsWith("/")) {
            currentPath = path;
          } else {
            currentPath = `${currentPath}/${path}`;
          }
        }
        const linkOrText = path ? (
          <Link className={classNames(classes.link, { [classes.currentItem]: index === mainNavPageHierarchy.length - 1 })} to={currentPath}>
 {title}
</Link>
) : (
 title
);
if (index === 0) {
 return (
   <Typography key={id} className={classes.breadcrumbItem} variant="body2">
     {linkOrText}
   </Typography>
 );
} else {
 return (
   <React.Fragment key={id}>
     <Typography className={classes.breadcrumbItem} variant="body2">
       {"/"}
     </Typography>
     <Typography className={classes.breadcrumbItem} variant="body2">
       {linkOrText}
     </Typography>
   </React.Fragment>
 );
}
})}
   </div>
 );
};