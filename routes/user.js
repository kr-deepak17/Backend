const express = require('express');
const app= express();
const {handleGetAllusers,
    handleGetUserById,
     handleUpdateUserById,
      handleDeleteUserById,
      handleCreateUser,
} =require('../controllers/user');

const router = express.Router();
router.route("/").get(handleGetAllusers).post(handleCreateUser);


// REST API's
router
    .route("/:id")
    .get(handleGetUserById)
    .patch(handleUpdateUserById)
    .delete(handleDeleteUserById);
    
    module.exports=router;
