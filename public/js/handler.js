const homePage = document.getElementById("Home");
const loginPage = document.getElementById("Login");
const signupPage = document.getElementById("Signup");
const parserPage = document.getElementById("Parser");
// const stopPage = document.getElementById("Stop");
const productPage = document.getElementById("Product");

let headers = new Headers();
headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
headers.append('Content-Type', 'application/json');



homePage.addEventListener("click", function () {
    console.log("Вы кликнули на div с id=Home");
    window.history.pushState(null, null, '/');
    window.location.reload();
});

loginPage.addEventListener("click", function () {
    console.log("Вы кликнули на div с id=Login");
    window.history.pushState(null, null, '/user/login');
    window.location.reload();
});

signupPage.addEventListener("click", function () {
    console.log("Вы кликнули на div с id=Signup");
    window.history.pushState(null, null, '/user/signup');
    window.location.reload();
});

parserPage.addEventListener("click", function () {
    console.log("Вы кликнули на div с id=Parser");
    function startLoadingParse() {

        function checkToken() {
            let token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }
        }

        checkToken()

        function sendTokenParse() {
            fetch('/parser', {
                headers: headers
            })
                // .then(response => response.json())
                .then(data => {
                    res.render('parser')
                });
        }

        sendTokenParse()
    }
    startLoadingParse()
    window.location.replace("/parser");
});

// stopPage.addEventListener("click", function () {
//     console.log("Вы кликнули на div с id=Stop");
// });

productPage.addEventListener("click", function () {
    console.log("Вы кликнули на div с id=Product");
    function startLoadingData() {
        function checkToken() {
            let token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }
        }

        checkToken()

        function sendTokenGetData() {
            fetch('/products', {
                headers: headers
            })
                //   .then(response => response.json())
                .then(data => {
                    res.render('products', { products: products });
                });
        }

        sendTokenGetData()
    }
    startLoadingData()
    window.location.replace("/products");
});





