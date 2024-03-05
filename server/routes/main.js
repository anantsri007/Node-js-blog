const express = require('express');  //we require express here because we will be able to get 
//routers from the express
const router = express.Router(); // here we are getting routers from express
const Post = require('../models/Post');

router.get('', async (req,res) => {
 try { const locals = {
    title: "NodeJs Blog",
    description: "Simple Blog created with NodeJs, Express & MongoDb."
  }

  let perPage = 6;
  let page = req.query.page || 1;


  const data = await Post.aggregate([ {$sort: { createdAt: -1}}])
  .skip(perPage * page - perPage)
  .limit(perPage)
  .exec();


  const count = await Post.countDocuments({});
  const nextPage = parseInt(page) + 1;
  const hasNextPage = nextPage <= Math.ceil(count / perPage);


   res.render('index', {
     locals,
     data,
     current: page,
     nextPage: hasNextPage ? nextPage : null,
     currentRoute: '/'
   });
 } catch (error)
 {
   console.log(error);
 }
 });
  //try {
   //const data = await Post.find();
 // } catch(error) {
 //  console.log(error);
 // }

//});


//  function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Building a Blog",
//       body: "This is the body text"
//     },
//     {
//       title: "Building a Blog",
//       body: "This is the body text"
//     },
//     {
//       title: "Building a Blog",
//       body: "This is the body text"
//     },
//     {
//       title: "Building a Blog",
//       body: "This is the body text"
//     },
//     {
//       title: "Building a Blog",
//       body: "This is the body text"
//     },
//     {
//       title: "Building a Blog",
//       body: "This is the body text"
//     },
//     {
//       title: "Building a Blog",
//       body: "This is the body text"
//     },
//     {
//       title: "Building a Blog",
//       body: "This is the body text"
//     },
//     {
//       title: "Building a Blog",
//       body: "This is the body text"
//     },
//     {
//       title: "Building a Blog",
//       body: "This is the body text"
//     },
//   ])
//  }

// insertPostData();//We have inserted data in our database now we have to check
//how we retrive our data from database



// router.get('/post/:id', async (req,res) => {
//   try { const locals = {
//    title: "NodeJs Blog", this will always NodeJs Blog title
//      // this will update title with post data
//      description: "Simple Blog created with NodeJs, Express & MongoDb."
//    }
 
   router.get('/post/:id', async (req,res) => {
    try {
      let slug = req.params.id; 

      const data = await Post.findById({_id: slug });
       const locals = {
     title: data.title,
       // this will update title with post data
       description: "Simple Blog created with NodeJs, Express & MongoDb.",
       currentRoute: `/post/${slug}`
     }

  res.render('post', { locals, data });
 }  catch (error) {
  console.log(error);
 }
  });


  router.post('/search', async (req,res) => {
   try {
    const locals = {
    title: "NodeJs Blog",
    description: "Simple Blog created with NodeJs, Express & MongoDb."
   }
   let searchTerm = req.body.searchTerm;
   const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
   
   const data = await Post.find({
    $or: [
    { title: { $regex: new RegExp(searchNoSpecialChar, 'i')}},
    {body: { $regex: new RegExp(searchNoSpecialChar, 'i')}}
    ]
  });

  res.render("search", {
    data,
    locals
  });
   } catch (error)
   {
    console.log(error);
   }
    
   });

  

router.get('/about', (req,res) => 
{
  res.render('about', {
  currentRoute: '/about'
});
});



module.exports = router;

//tHIS MAIN ROUTE
//AFTER THIS WE CREATE HOME ROUTE 
// CONTACT ROUTE
//AND MORE ROUTES
