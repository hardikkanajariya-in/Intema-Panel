import AppearanceController from './AppearanceController'
import DashboardController from './DashboardController'
import ClientController from './ClientController'
import DatabaseController from './DatabaseController'
import NginxController from './NginxController'
import SslController from './SslController'
import CloudflareController from './CloudflareController'
import SystemController from './SystemController'
import SettingsController from './SettingsController'
const Controllers = {
    AppearanceController: Object.assign(AppearanceController, AppearanceController),
DashboardController: Object.assign(DashboardController, DashboardController),
ClientController: Object.assign(ClientController, ClientController),
DatabaseController: Object.assign(DatabaseController, DatabaseController),
NginxController: Object.assign(NginxController, NginxController),
SslController: Object.assign(SslController, SslController),
CloudflareController: Object.assign(CloudflareController, CloudflareController),
SystemController: Object.assign(SystemController, SystemController),
SettingsController: Object.assign(SettingsController, SettingsController),
}

export default Controllers