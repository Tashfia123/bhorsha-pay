import {
  Dashboard,
  Campaign,
  CreditCard,
  LocalAtm,
  Article,
  Bookmark,
  AccountCircle,
  Analytics, // For Dashboard
  VolunteerActivism, // For Donated Campaign
} from "@mui/icons-material"; // ✅ Using Material UI Icons

export const navlinks = [
  {
    name: "Discover Campaign",
    imgUrl: "Dashboard", // ✅ Store MUI icon name as a string
    link: "/home",
  },
  {
    name: "Campaign",
    imgUrl: "Campaign",
    link: "/create-campaign",
  },
  {
    name: "FAQ",
    imgUrl: "CreditCard",
    link: "/chatbot",
  },
  {
    name: "Donated Campaign",
    imgUrl: "VolunteerActivism",
    link: "/donated-campaigns",
  },
  {
    name: "Blogs",
    imgUrl: "Article",
    link: "/blogs",
  },
  {
    name: "Bookmarks",
    imgUrl: "Bookmark",
    link: "/bookmarks",
  },

  {
    name: "Profile",
    imgUrl: "AccountCircle",
    link: "/profile",
  },
  {
    name: "Dashboard",
    imgUrl: "Analytics",
    link: "/dashboard",
  },
];
