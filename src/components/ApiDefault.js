import axios from 'axios';
const ApiDefault = {
    url : "/lol",
    key : "RGAPI-4b3d4787-b483-40be-a4c7-52e2fe280f80"
}
ApiDefault.instance = axios.create({ baseURL : ApiDefault.url }); // 이런녀석들은
export default ApiDefault;  