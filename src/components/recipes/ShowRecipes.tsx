
import type React from "react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import type { RecipeInputs } from "../Objects";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Divider,
  Chip,
  CardActionArea,
  Collapse,
  IconButton,
  ThemeProvider,
  createTheme,
  Paper,
  Avatar,
  CardMedia,
  CardHeader,
  alpha,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import KitchenIcon from "@mui/icons-material/Kitchen";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { userContext } from "../../Context/UserContext";

// Custom theme with gold colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#FFD700",
      light: "#FFE135",
      dark: "#B8860B",
    },
    secondary: {
      main: "#DAA520",
      light: "#F0E68C",
      dark: "#8B4513",
    },
    error: {
      main: "#e74c3c", // Tomato red
    },
    background: {
      default: "#f9f5f0", // Warm cream background
      paper: "#ffffff",
    },
    text: {
      primary: "#34495e", // Dark blue-gray
      secondary: "#7f8c8d", // Medium gray
    },
  },
  typography: {
    fontFamily: "'Heebo', 'Roboto', 'Arial', sans-serif",
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 8px 24px rgba(149, 157, 165, 0.2)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

// Difficulty level colors
const difficultyColors = {
  1: "#FFD700", // Gold for easy
  2: "#DAA520", // Goldenrod for medium
  3: "#e74c3c", // Red for hard
};

// Category colors - will be assigned dynamically
const categoryColors = {
  1: "#FFD700", // Gold
  2: "#DAA520", // Goldenrod
  3: "#FFD700", // Gold
  4: "#DAA520", // Goldenrod
  5: "#FFD700", // Gold
  6: "#DAA520", // Goldenrod
  7: "#FFD700", // Gold
  8: "#DAA520", // Goldenrod
  9: "#FFD700", // Gold
  10: "#DAA520", // Goldenrod
};

const ShowRecipes = () => {
  const { myUser } = useContext(userContext);
  const [recipes, setRecipes] = useState<RecipeInputs[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchCategories();
    fetchRecipes();
  }, []);

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (recipeId: number, UserId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (myUser?.Id === UserId) {
      try {
        await axios.post(`http://localhost:8080/api/recipe/delete/${recipeId}`);
        setRecipes(recipes.filter((recipe) => recipe.Id !== recipeId));
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    } else {
      alert("אינך מורשה למחוק את המתכון כי לא אתה הכנסת אותו");
    }
  };

  const handleEditRecipe = (id: number, UserId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (UserId === myUser?.Id) {
      navigate(`/EditRecipe/${id}`);
    } else {
      alert("אינך מורשה לערוך את המתכון כי לא אתה הכנסת אותו");
    }
  };

  const toggleFavorite = (recipeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [recipeId]: !prev[recipeId],
    }));
  };

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get<RecipeInputs[]>("http://localhost:8080/api/recipe");
      setRecipes(response.data);
      console.log("Fetched recipes:", response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCardExpand = (recipeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedCards((prev) => ({
      ...prev,
      [recipeId]: !prev[recipeId],
    }));
  };

  const getCategoryColor = (Categoryid: number | null | undefined) => {
    if (Categoryid === null || Categoryid === undefined) return "#999999";
    return categoryColors[Categoryid as keyof typeof categoryColors] || "#999999";
  };

  const getCategoryName = (Categoryid: number | null | undefined) => {
    if (Categoryid === null || Categoryid === undefined) return "ללא קטגוריה";
    const category = categories.find((cat) => cat.Id === Categoryid);
    return category ? category.Name : "ללא קטגוריה";
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper
        sx={{
          padding: "30px",
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          borderRadius: 0,
          opacity: "85%"
        }}
        className="container"
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: theme.palette.primary.main,
              display: "flex",
              alignItems: "center",
            }}
          >
            <RestaurantMenuIcon sx={{ mr: 1, fontSize: 32 }} />
            המתכונים
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress color="primary" size={60} thickness={5} />
          </Box>
        ) : (
          <>
            {recipes.length > 0 ? (
              <Grid container spacing={3}>
                {recipes.map((recipe) => (
                  <Grid item xs={12} sm={6} md={4} key={recipe.Id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 16px 70px -12px rgba(0, 0, 0, 0.25)",
                        },
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: "100%",
                          height: "4px",
                          bgcolor: getCategoryColor(recipe.Categoryid),
                          zIndex: 1,
                        }}
                      />

                      <CardHeader
                        avatar={
                          <Avatar
                            sx={{
                              bgcolor: getCategoryColor(recipe.Categoryid),
                              width: 40,
                              height: 40,
                            }}
                          >
                            {recipe.Name.charAt(0)}
                          </Avatar>
                        }
                        title={
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              fontSize: "1.1rem",
                              textAlign: "right",
                              direction: "rtl",
                            }}
                          >
                            {recipe.Name}
                          </Typography>
                        }
                        subheader={
                          <Chip
                            label={getCategoryName(recipe.Categoryid)}
                            size="small"
                            sx={{
                              bgcolor: alpha(getCategoryColor(recipe.Categoryid), 0.1),
                              color: getCategoryColor(recipe.Categoryid),
                              fontWeight: 500,
                              mt: 0.5,
                            }}
                          />
                        }
                        sx={{ pb: 0 }}
                      />

                      <CardActionArea onClick={(e) => toggleCardExpand(recipe.Id, e)}>
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            height="200"
                            alt={recipe.Name}
                            sx={{
                              objectFit: "cover",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              bgcolor: "rgba(0,0,0,0.6)",
                              color: "white",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              px: 2,
                              py: 1,
                            }}
                          >
                            <Chip
                              icon={<AccessTimeIcon sx={{ color: "white !important" }} />}
                              label={`${recipe.Duration} דקות`}
                              sx={{
                                bgcolor: "rgba(255,255,255,0.2)",
                                color: "white",
                                fontWeight: 500,
                                backdropFilter: "blur(4px)",
                              }}
                              size="small"
                            />
                            <Chip
                              icon={<StarIcon sx={{ color: "white !important" }} />}
                              label={recipe.Difficulty}
                              sx={{
                                bgcolor: alpha(
                                  difficultyColors[recipe.Difficulty as unknown as keyof typeof difficultyColors] || "#777",
                                  0.8,
                                ),
                                color: "white",
                                fontWeight: 500,
                                backdropFilter: "blur(4px)",
                              }}
                              size="small"
                            />
                          </Box>
                        </Box>

                        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Tooltip title="הוסף למועדפים">
                                <IconButton
                                  onClick={(e) => toggleFavorite(recipe.Id, e)}
                                  sx={{
                                    color: favorites[recipe.Id] ? theme.palette.error.main : "rgba(0, 0, 0, 0.54)",
                                    transition: "all 0.3s ease",
                                    "&:hover": { transform: "scale(1.1)" },
                                  }}
                                >
                                  <FavoriteIcon
                                    sx={{
                                      fill: favorites[recipe.Id] ? theme.palette.error.main : "transparent",
                                      stroke: favorites[recipe.Id] ? "none" : "currentColor",
                                      strokeWidth: favorites[recipe.Id] ? 0 : 1,
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="ערוך מתכון">
                                <IconButton
                                  onClick={(e) => handleEditRecipe(recipe.Id, recipe.UserId, e)}
                                  size="small"
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    transition: "all 0.3s ease",
                                    "&:hover": { transform: "scale(1.1)" },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="מחק מתכון">
                                <IconButton
                                  onClick={(e) => handleDelete(recipe.Id, recipe.UserId, e)}
                                  size="small"
                                  sx={{
                                    color: theme.palette.error.main,
                                    transition: "all 0.3s ease",
                                    "&:hover": { transform: "scale(1.1)" },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>

                            <IconButton size="small" onClick={(e) => toggleCardExpand(recipe.Id, e)}>
                              {expandedCards[recipe.Id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </Box>

                          {!expandedCards[recipe.Id] && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                textAlign: "right",
                                direction: "rtl",
                              }}
                            >
                              {recipe.Description}
                            </Typography>
                          )}
                        </CardContent>
                      </CardActionArea>

                      <Collapse in={expandedCards[recipe.Id]} timeout="auto" unmountOnExit>
                        <CardContent sx={{ pt: 0 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                            sx={{ textAlign: "right", direction: "rtl" }}
                          >
                            {recipe.Description}
                          </Typography>

                          <Divider sx={{ my: 2 }} />

                          <Typography
                            variant="h6"
                            sx={{
                              color: theme.palette.primary.main,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              mb: 1,
                              direction: "rtl",
                            }}
                          >
                            רכיבים
                            <LocalDiningIcon sx={{ ml: 1 }} />
                          </Typography>

                          <Box sx={{ textAlign: "right", direction: "rtl" }}>
                            {recipe.Ingridents && recipe.Ingridents.length > 0 ? (
                              recipe.Ingridents.map((ing, idx) => (
                                <Chip
                                  key={idx}
                                  label={`${ing.Name} - ${ing.Count} ${ing.Type}`}
                                  sx={{ m: 0.5, bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                                  size="small"
                                />
                              ))
                            ) : (
                              <Typography variant="body2">אין מרכיבים זמינים</Typography>
                            )}
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Typography
                            variant="h6"
                            sx={{
                              color: theme.palette.primary.main,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              mb: 1,
                              direction: "rtl",
                            }}
                          >
                            הוראות הכנה
                            <KitchenIcon sx={{ ml: 1 }} />
                          </Typography>

                          <Box sx={{ textAlign: "right", direction: "rtl" }}>
                            {recipe.Instructions && recipe.Instructions.length > 0 ? (
                              recipe.Instructions.map((instruction: any, idx: any) => (
                                <Box
                                  key={idx}
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    mb: 1,
                                    gap: 1,
                                  }}
                                >
                                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                    {instruction.Name}
                                  </Typography>
                                  <Avatar
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      fontSize: 14,
                                      bgcolor: theme.palette.primary.main,
                                    }}
                                  >
                                    {idx + 1}
                                  </Avatar>
                                </Box>
                              ))
                            ) : (
                              <Typography variant="body2">אין הוראות הכנה זמינות</Typography>
                            )}
                          </Box>
                        </CardContent>
                      </Collapse>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "50vh",
                }}
              >
                <RestaurantMenuIcon sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.3), mb: 2 }} />
                <Typography variant="h5" color="text.secondary">
                  אין מתכונים זמינים
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  נסו להוסיף מתכונים חדשים
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>
    </ThemeProvider>
  );
};

export default ShowRecipes;
