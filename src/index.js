import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter  } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import App from './routes';
import 'antd/dist/antd.css';
import zhCN from 'antd/es/locale/zh_CN';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	<HashRouter>
		<ConfigProvider locale={zhCN}>
			<App />
		</ConfigProvider>
	</HashRouter>,
	document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
