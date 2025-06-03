// import React from "react";
// import {
//   TextField,
//   MenuItem,
//   Button,
//   Box,
//   Typography,
//   Popover,
// } from "@mui/material";
// import FilterListIcon from "@mui/icons-material/FilterList";

// const Filter = ({
//   anchorEl,
//   handleFilterClick,
//   handleClose,
//   categories,
//   filterCategory,
//   setFilterCategory,
//   filterDuration,
//   setFilterDuration,
//   filterDifficulty,
//   setFilterDifficulty,
//   filterUserId,
//   setFilterUserId,
//   myUser,
// }) => {
//   const open = Boolean(anchorEl);

//   return (
//     <>
//       <Button
//         variant="contained"
//         onClick={handleFilterClick}
//         startIcon={<FilterListIcon />}
//         sx={{
//           backgroundColor: "#FFD700",
//           color: "white",
//           borderRadius: "30px",
//           padding: "10px 20px",
//           "&:hover": {
//             backgroundColor: "#B8860B",
//             transform: "translateY(-2px)",
//             boxShadow: "0 6px 20px rgba(230, 126, 34, 0.4)",
//           },
//           transition: "all 0.3s ease",
//         }}
//       >
//         סינון
//       </Button>

//       <Popover
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "left",
//         }}
//         transformOrigin={{
//           vertical: "top",
//           horizontal: "left",
//         }}
//         PaperProps={{
//           sx: {
//             p: 3,
//             width: 300,
//             borderRadius: 3,
//             boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
//           },
//         }}
//       >
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#FFD700" }}>
//           סינון מתכונים
//         </Typography>
//         <Box component="form" sx={{ "& .MuiTextField-root": { mb: 2 } }}>
//           <TextField
//             select
//             label="קטגוריה"
//             value={filterCategory}
//             onChange={(e) => setFilterCategory(e.target.value)}
//             fullWidth
//             variant="outlined"
//             color="primary"
//           >
//             <MenuItem value=""> קטגוריות</MenuItem>
//             {categories.map((category:any) => (
//               <MenuItem key={category.Id} value={category.Id}>
//                 {category.Name}
//               </MenuItem>
//             ))}
//           </TextField>
//           <TextField
//             type="number"
//             label="זמן הכנה מקסימלי (דקות)"
//             value={filterDuration}
//             onChange={(e) => setFilterDuration(e.target.value ? Number(e.target.value) : "")}
//             fullWidth
//             variant="outlined"
//             color="primary"
//           />
//           <TextField
//             select
//             label="רמת קושי"
//             value={filterDifficulty}
//             onChange={(e) => setFilterDifficulty(e.target.value ? Number(e.target.value) : "")}
//             fullWidth
//             variant="outlined"
//             color="primary"
//           >
//             <MenuItem value=''>כל הרמות</MenuItem>
//             <MenuItem value={1}>קל</MenuItem>
//             <MenuItem value={2}>בינוני</MenuItem>
//             <MenuItem value={3}>קשה</MenuItem>
//           </TextField>
//           {myUser && (
//             <TextField
//               type="number"
//               label="נוצר על ידי (מזהה משתמש)"
//               value={filterUserId}
//               onChange={(e) => setFilterUserId(e.target.value ? Number(e.target.value) : "")}
//               fullWidth
//               variant="outlined"
//               color="primary"
//             />
//           )}
//           <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleClose} color="primary">
//             החל סינון
//           </Button>
//         </Box>
//       </Popover>
//     </>
//   );
// };

// export default Filter;
