const express = require('express');
//const { engine } = require('express/lib/application');
const morgan = require('morgan');
//const res = require('express/lib/response');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');
const { render } = require('express/lib/response');


//Express app
const app = express();
//connect to mongodb
const dbURI = 'mongodb+srv://Shawon:shawon@nodecluster.8klmo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err))

// register View engine
app.set('view engine', 'ejs');

//middle & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// //mongoose and mongo sandbox routes
// app.get('/add-blog', (req, res) => {
//   const blog = new Blog({
//     title: 'New Blog 2',
//     snippet: 'about my new blog',
//     body: 'more about my blog'
//   });
//   blog.save()
//     .then((result) => {
//       res.send(result)
//     })
//     .catch((err) => {
//       console.log(err)
//     });
// });
// //single
// app.get('/single-blog', (req, res) => {
//   Blog.findById('61dc47c38e23cbdc0d2cc49e')
//     .then((result) => {
//       res.send(result)
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// })

// //all
// app.get('/all-blogs', (req, res) => {
//   Blog.find()
//     .then((result) => {
//       res.send(result)
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// })

app.get('/', (req, res) => {
  //res.send('<p>Home page</p>');
  //res.sendFile('./views/home.html', { root: __dirname });
  // const blogs = [
  //   { title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur' },
  //   { title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur' },
  //   { title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur' },
  // ];
  // res.render('index', { title: 'Home', blogs });
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  //res.send('<p>About page</p>');
  //res.sendFile('./views/about.html', { root: __dirname });
  res.render('about', { title: 'About' });
});
//Blog Routes
app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then((result) => {
      res.render('index', { title: 'All Blogs', blogs: result })
    })
    .catch((err) => {
      console.log(err)
    });
});

app.post('/blogs', (req, res) => {
  const blog = new Blog(req.body);
  blog.save()
    .then((result) => {
      res.redirect('/blogs');
    })
    .catch((err) => {
      console.log(err);
    })
})
app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render('details', { blog: result, title: 'Blog Details' })
    })
    .catch((err) => {
      console.log(err)
    })
})
app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create' });
})
//redirects
// app.get('/about-us', (req, res) => {
//   res.redirect('/about');
// });
//404 page
app.use((req, res) => {
  // res.status(404).sendFile('./views/404.html', { root: __dirname });
  res.status(404).render('404', { title: '404' })
});