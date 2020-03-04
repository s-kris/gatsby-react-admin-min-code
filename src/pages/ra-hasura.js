import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { createHashHistory } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route } from 'react-router-dom'
import withContext from 'recompose/withContext'
import { AuthContext, DataProviderContext, Resource, List, Datagrid, TextField } from 'react-admin'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core'
import buildHasuraProvider from 'ra-data-hasura-graphql'

import Layout from '../components/layout'
import Dashboard from '../components/dashboard'
import createAdminStore from '../createAdminStore'




const authProvider = () => Promise.resolve()
const history = createHashHistory()
const theme = createMuiTheme({
    props: {
        MuiTypography: {
            variantMapping: {
                h1: 'h2',
                h2: 'h2',
                h3: 'h2',
                h4: 'h2',
                h5: 'h2',
                h6: 'h2',
                subtitle1: 'h2',
                subtitle2: 'h2',
                body1: 'span',
                body2: 'span',
            },
        },
    },
})

const PostList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
        </Datagrid>
    </List>
)

const headers = {}

const ReactAdminPage = () => {
    const [dataProvider, setDataProvider] = useState(null)
    useEffect(() => {
        buildHasuraProvider({ clientOptions: { uri: process.env.GRAPHQL_API_URL, headers } }).then(dp => {
            setDataProvider({ dataProvider: dp })
        })
    }, [])

    if (!dataProvider) {
        return <div>intialising hasura data provider...</div>
    }

    return <Layout>
        react-admin-min-code
    <Provider store={createAdminStore({
            authProvider,
            dataProvider,
            history,
        })}>
            <AuthContext.Provider value={authProvider}>
                <DataProviderContext.Provider value={dataProvider}>
                    <ThemeProvider theme={theme}>
                        <Resource name="posts" intent="registration" />
                        <ConnectedRouter history={history}>
                            <Switch>
                                <Route exact path="/" component={Dashboard} />
                                <Route exact path="/posts" hasCreate render={(routeProps) => <PostList resource="posts" basePath={routeProps.match.url} {...routeProps} />} />

                            </Switch>
                        </ConnectedRouter>
                    </ThemeProvider>
                </DataProviderContext.Provider>
            </AuthContext.Provider>
        </Provider>
    </Layout>
}

// export default ReactAdminPage


export default withContext({
},
    () => ({})
)(ReactAdminPage)