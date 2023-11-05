import {DataSource} from 'typeorm'
import { ormConfig } from './orm.config'

const dataSource = new DataSource(ormConfig)

dataSource.initialize()

export default dataSource
