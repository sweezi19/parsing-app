function saveToken(form, route) {
   form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const { first_name, last_name, email, password } = Object.fromEntries(formData);

      try {
         if (route === '/user/signup') {
            const res = await fetch('/user/signup', {
               method: 'POST',
               body: JSON.stringify({ first_name, last_name, email, password }),
               headers: {
                  'Content-Type': 'application/json',
               },
            });

            if (!res.ok) {
               throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            if (data.token) {
               localStorage.setItem('token', data.token);
            } else {
               console.log("Error: ", data.error);
            }
         } else if (route === '/user/login') {
            const res = await fetch('/user/login', {
               method: 'POST',
               body: JSON.stringify({ email, password }),
               headers: {
                  'Content-Type': 'application/json',
               },
            });

            if (!res.ok) {
               throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            if (data.token) {
               localStorage.setItem('token', data.token);
               console.log('Token saved to localStorage:', data.token);

            } else {
               console.log("Error: ", data.error);
            }
         }      
      } catch (error) {
         console.error('Fetch request failed:', error.message);
      }
   });
}

saveToken(document.querySelector('form'), '/user/signup');

saveToken(document.querySelector('form'), '/user/login');


// function checkToken() {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     // Токен не сохранен в localStorage
//     return false;
//   }

//   // Для проверки действительности токена необходимо выполнить запрос к серверу,
//   // передав токен в заголовке авторизации
//   return fetch('url', {
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   })
//   .then(response => {
//     if (!response.ok) {
//       // Ошибка при проверке токена
//       return false;
//     }

//     // Токен действителен
//     return true;
//   })
//   .catch(error => {
//     console.error(error);
//     // Произошла ошибка при выполнении запроса
//     return false;
//   });
// }

