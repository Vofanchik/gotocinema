# Сервис бронирования билетов в кино онлайн
Сервис бронирования билетов в кино онлайн на React, express и sqlite.
## Клиентская часть бронирования билетов онлайн
![image](https://github.com/user-attachments/assets/85e14508-8ab5-47fc-8525-6b77886a5034)
![image](https://github.com/user-attachments/assets/5af3c54d-4826-4fc5-bf6a-c2aaea43d99b)
![image](https://github.com/user-attachments/assets/e2abafdb-304f-46cc-81ae-c74d140d7b38)
![image](https://github.com/user-attachments/assets/1d53445c-2b8f-413d-aef9-f263257fabe9)
### Возможности гостя
* Просмотр расписания.
* Просмотр списка фильмов.
* Выбор места в кинозале.
* Бронирование билета на конкретную дату.

## Администраторская часть сайта
![image](https://github.com/user-attachments/assets/7c7266bd-96b1-49de-8de4-001dcad886b0)
![image](https://github.com/user-attachments/assets/7fc60a7f-ff2d-4df4-92ee-c73262c8f015)
![image](https://github.com/user-attachments/assets/fbe12d1a-8158-4deb-839f-8cf3a440ca58)
![image](https://github.com/user-attachments/assets/d67dd782-73b4-47b4-90d5-7a1bd622005d)
![image](https://github.com/user-attachments/assets/4194a8f5-0f55-4ecd-ac28-0aa39d9ac616)

### Возможности администратора
* Создание или редактирование залов.
* Создание или редактирование списка фильмов.
* Настройка цен.
* Создание или редактирование расписания сеансов фильмов.
# Подготовка
## Разворачивание backend сервера
```
cd back
npm i
npm run migrate
npm run migrate_data # для тестовых данных
npm run start
```

## Разворачивание frontend сервера
```
cd front
npm i
npm run start
```

# Использование
## Данные для панели администратора
- Login: admin@admin.ru
- Password: admin
