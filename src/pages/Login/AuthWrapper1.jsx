// material-ui
import { styled } from '@mui/material/styles';

// project imports

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

// const AuthWrapper1 = styled('div')(({ theme }) => ({
//   // backgroundColor: theme.palette.grey[100],
//   backgroundImage:URL('https://i.pinimg.com/736x/f2/3c/91/f23c91806daf87b74b01f1730019a270.jpg'),
//   minHeight: '100vh',
//   alignItems: 'center'
// }));

const AuthWrapper1 = styled('div')(({ theme }) => ({
  backgroundImage: `url('https://i.pinimg.com/736x/ac/75/5d/ac755de9b04c8ab91915d9286763fb15.jpg')`,
  backgroundSize: 'contain', 
  backgroundPosition: 'center', 
  minHeight: '100vh',
  display: 'flex', 
  alignItems: 'center',
  justifyContent: 'center', 
}));

export default AuthWrapper1;
