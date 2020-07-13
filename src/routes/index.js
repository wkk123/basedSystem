import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import '@/css/base.css';
import '@/css/iconfont.css';
import routes from './routes';

export default class App extends Component {
  render() {
		return (
		  <div className="App">
				<Switch>
          {
            routes.map((item,index)=>
              <Route 
                path = {
                  item.path
                }
                exact = {
                  item.exact
                }
                component = {
                  item.component
                }
                key={
                  'route'+index
                }
              /> 
            )
          }
					<Redirect from="/*" to="/" />
				</Switch>
		  </div>
		)
  }
}

