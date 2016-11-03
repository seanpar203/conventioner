# conventioner
Converts objects to proper language naming conventions.

#Installation

`npm install conventioner`

or for yarn users:

`yarn add conventioner`


# Usage
passing a **Single Level** object to the function `conventioner` will attempt to convert `underscore` and `PascalCase`
to `camelCase` and `camelCase` to `underscore` by default. See [Selecting Conventions](#selecting-convention) to override
the default behavior.


# Non Trivial Usage

``` js
import conventioner from 'conventioner';

const data = {
    blog_name:  'Some blog name',
    blog_likes: 15,
};

conventioner(blog);

// output
{
    blogName:  'Some blog name',
    blogLikes: 15,
};

```


# More Complex Examples

This example shows a mock of communicating with a backend that uses underscore naming convention
like `Python`(:heart_eyes:), `Ruby` and `PHP`(:poop:).

This makes keeping language naming conventions easy & allows you to focus on building your app.

```js
import conventioner from 'conventioner';

state: {
     user: {
        userId:       1,
        userName:     'Some user',
        userEmail:    'some@gmail.com',
        userAddress:  '42 holley drive',
        userBirthday: 'may 3rd, 1991',
    };
}


// Example method
function updateUser() {
    $http.post('/api/user/', conventioner(state.user))
        .then(res => state.user = conventioner(res.data.user))
        .catch(err => console.log(err));
}
```

# Other Support Conventions
Currently, `underscores`, `camelCase` and `PascalCase` is supported and transitioning
between any of them is possible.


# Selecting Convention

The `to` parameter is optional but allows to override the default conventioner behavior:

`conventioner(data[,to])`


#### From PascalCase to underscores.

```js
import conventioner from 'conventioner';

data = {PropName: true};


output = conventioner(data, '_');


// output
{
    prop_name: true
}

```

#### From underscores to PascalCase
```js
import conventioner from 'conventioner';

data = {prop_name: true};


output = conventioner(data, 'PC');


// output
{
    PropName: true
}

```

#### From camelCase to PascalCase
```js
import conventioner from 'conventioner';

data = {propName: true};


output = conventioner(data, 'PC');


// output
{
    PropName: true
}

```
