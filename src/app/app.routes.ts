import { Routes } from '@angular/router';
import { ConfigsComponent } from './configs/configs.component';
import { BlacklisttypeComponent } from './blacklisttype/blacklisttype.component';
import { AdminComponent } from './admin/admin.component';
import { UserListComponent } from './user-list/user-list.component';
import { AddUserComponent } from './add-user/add-user.component';
import { CustomRulesComponent } from './custom-rules/custom-rules.component';
import { ComplianceComponent } from './compliance/compliance.component';
import { PaymentinComponent } from './paymentin/paymentin.component';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { RoleConfigComponent } from './role-config/role-config.component';
import { AssignRoleComponent } from './assign-role/assign-role.component';
import { RoleMastersComponent } from './role-masters/role-masters.component';
import { CreateRoleMasterComponent } from './create-role-master/create-role-master.component';
import { AddBlacklisttypeComponent } from './add-blacklisttype/add-blacklisttype.component';
import { BlacklistDetailsComponent } from './blacklist-details/blacklist-details.component';
import { BlacklistTypeMasterComponent } from './blacklist-type-master/blacklist-type-master.component';
import { WhitelistDetailsComponent } from './whitelist-details/whitelist-details.component';
import { AddWhitelistDetailsComponent } from './add-whitelist-details/add-whitelist-details.component';
import { ServiceConfigurationComponent } from './service-configuration/service-configuration.component';
import { ServiceRuleDetailsComponent } from './service-rule-details/service-rule-details.component';
import { ServiceRulesComponent } from './service-rules/service-rules.component';
import { AddCustomRuleComponent } from './add-custom-rule/add-custom-rule.component';
import { AddBannedBeneComponent } from './add-banned-bene/add-banned-bene.component';
import { BannedBeneComponent } from './banned-bene/banned-bene.component';
import { RiskDetailsComponent } from './risk-details/risk-details.component';
import { RiskManagementComponent } from './risk-management/risk-management.component';
import { PayindetailsComponent } from './payindetails/payindetails.component';
import { PaymentoutComponent } from './paymentout/paymentout.component';
import { PayinServicesComponent } from './payin-services/payin-services.component';
import { PayinServiceComponent } from './payin-service/payin-service.component';
import { PayinActivityLogComponent } from './payin-activity-log/payin-activity-log.component';
import { PayoutDocsComponent } from './payout-docs/payout-docs.component';
import { PayoutActivityLogComponent } from './payout-activity-log/payout-activity-log.component';
import { PayoutServiceComponent } from './payout-service/payout-service.component';
import { PayoutdetailsComponent } from './payoutdetails/payoutdetails.component';
import { PayoutServicesComponent } from './payout-services/payout-services.component';
import { PayinDocsComponent } from './payin-docs/payin-docs.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VarifyOtpComponent } from './varify-otp/varify-otp.component';
import { ReportComponent } from './report/report.component';
import { PayinReportComponent } from './payin-report/payin-report.component';
import { PayoutReportComponent } from './payout-report/payout-report.component';
import { OutDashComponent } from './out-dash/out-dash.component';
import { GraphComponent } from './graph/graph.component';
import { PaymentInGraphComponent } from './payment-in-graph/payment-in-graph.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'verify-otp', component: VarifyOtpComponent },
  {
    path: 'out-dash', component: OutDashComponent,
    children: [
      {
        path: 'graph', component: GraphComponent,
        children: [
          {path: '', redirectTo: 'pay-in-graph', pathMatch: 'full'},
          {path: 'pay-in-graph', component: PaymentInGraphComponent},
          // {path: 'pfx-graph', component: PFXRegistrationGraphComponent},
          // {path: 'cfx-graph', component: CFXRegistrationGraphComponent},
          // {path: 'pay-out-graph', component: PaymentOutGraphComponent},
        ]
      }
    ]
  },
  {
    path: 'Admin', component: AdminComponent,
    children: [
      { path: '', redirectTo: 'Users', pathMatch: 'full' },
      { path: 'Users', component: UserListComponent },
      { path: 'Add_User', component: AddUserComponent }
    ]
  },
  {
    path: 'Compliance', component: ComplianceComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'PayIn_Queue' },
      { path: 'PayIn_Queue', component: PaymentinComponent },
      { path: 'PayOut_Queue', component: PaymentoutComponent }
    ]
  },
  {
    path: 'Configuration', component: ConfigsComponent,
    children: [
      { path: 'Add_BlackList_Type', component: BlacklisttypeComponent },
      { path: 'Blacklist_Details', component: AddBlacklisttypeComponent,data :{disableSearch:true} },
      { path: 'Add_BlackList_Details', component: BlacklistDetailsComponent },
      { path: 'Blacklist_Type_Master', component: BlacklistTypeMasterComponent,data :{disableSearch:true}},
      { path: 'Add_Whitelist_Details', component: WhitelistDetailsComponent },
      { path: 'Whitelist_Details', component: AddWhitelistDetailsComponent },
      { path: 'Add_Service_Rule', component: ServiceRulesComponent ,data :{disableSearch:true}},
      { path: 'service-rule-details', component: ServiceRuleDetailsComponent },
      { path: 'Create_Service_Rule', component: ServiceConfigurationComponent },
      { path: 'Custom_Rule', component: CustomRulesComponent ,data :{disableSearch:true}},
      { path: 'Add_Custom_Rule', component: AddCustomRuleComponent,data :{disableSearch:true} },
      { path: 'Banned_Bene', component: BannedBeneComponent ,data :{disableSearch:true} },
      { path: 'Add_Banned_Bene', component: AddBannedBeneComponent ,data :{disableSearch:true}},
      { path: 'Risk_Assessment', component: RiskManagementComponent ,data :{disableSearch:true}},
      { path: 'Risk_Assessment_Details', component: RiskDetailsComponent ,data :{disableSearch:true}},
    ]
  },
  {
    path: 'User_Permission', component: UserPermissionComponent,
    children: [
      { path: 'Role_Master', component: RoleMastersComponent },
      { path: 'Add_Role', component: CreateRoleMasterComponent },
      { path: 'Assign_Role', component: AssignRoleComponent, },
      { path: 'Role_Configuration', component: RoleConfigComponent, }
    ]
  },
  {
    path: 'Payin_Service', component: PayinServicesComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'Details' },
      { path: 'Details', component: PayindetailsComponent },
      { path: 'Services', component: PayinServiceComponent },
      { path: 'Attachments', component: PayinDocsComponent },
      { path: 'Logs', component: PayinActivityLogComponent },
    ]
  },
  {
    path: 'Payout_Service', component: PayoutServicesComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'Details' },
      { path: 'Details', component: PayoutdetailsComponent },
      { path: 'Services', component: PayoutServiceComponent },
      { path: 'Attachments', component: PayoutDocsComponent },
      { path: 'Logs', component: PayoutActivityLogComponent },
    ]
  },
  {
    path: 'Report', component: ReportComponent,
    children: [
      { path: 'PaymentIn', component: PayinReportComponent },
      { path: 'PaymentOut', component: PayoutReportComponent },
    ]
  },
  {
    path: 'payin-details', component: PayindetailsComponent
  }
];
