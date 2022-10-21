import axios from "axios";

export const getUsers = async () => {
  const response = await axios.get("https://assets.interviewhelp.io/INTERVIEW_HELP/reactjs/users.json");
  return response.data;
}

export const getLogs = async () => {
  const response = await axios.get("https://assets.interviewhelp.io/INTERVIEW_HELP/reactjs/logs.json");
  return response.data;
}