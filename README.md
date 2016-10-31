# conventioner
Converts objects to proper language naming conventions.

#Installation

`npm install conventioner`

or for yarn users:

`yarn add conventioner`


# Usage
There is only one way to use the library which is passing in an object
to the function `conventioner` which returns a formatted object based on
what convention was passed in.


# Non Trivial Usage

``` js
import conventioner from 'conventioner';

const blog = {
    blogDate:      'june 24, 1999',
    blogName:      'Some blog name',
    blogTags:      ['Test', '1', true, false],
    blogBody:      'lorem ipsum would go here.',
    blogLikes:     15,
    blogPoster:    'Some user here',
    blogFollowers: ['Peter', 'John', 'Doe'],
};


conventioner(blog);


/** Return underscore convention. */
{
    blog_date:      'june 24, 1999',
    blog_name:      'Some blog name',
    blog_tags:      ['Test', '1', true, false],
    blog_body:      'lorem ipsum would go here.',
    blog_likes:     15,
    blog_poster:    'Some user here',
    blog_followers: ['Peter', 'John', 'Doe'],
};

```


# More Complex Examples
This example shows interacting with a server that uses underscore conventions
and allows you to focus on building while following proper naming conventions
on both the server and the front end of the application.

```js
state: {
     user: {
        user_id:       1,
        user_name:     'Some user',
        user_email:    'some@gmail.com',
        user_birthday: 'may 3rd, 1991',
        user_address:  '42 holley drive',
    };
}


// Example method
function updateUser() {
    $http.post('/api/user/', conventioner(state.user))
        .then(res => state.user = conventioner(res.data.user))
        .catch(err => console.log(err));
}
```

