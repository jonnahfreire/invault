import GetAllDocumentIssuersUseCase from "@usecases/organization/get-all-document-issuers.usecase";
import GetAllProductTypesUseCase from "@usecases/organization/get-all-product-types.usecase";
import CreateOrderUseCase from "@usecases/order/create-order.usecase";
import CreateOrganizationUseCase from "@usecases/organization/create-organization.usecase";
import GetAllCustomersUseCase from "@usecases/store/get-all-customers.usecase";
import GetAllProductsUseCase from "@usecases/product/get-all-products.usecase";
import GetAllPartnersUseCase from "@usecases/partner/get-all-partners.usecase";
import GetProductUseCase from "@usecases/product/get-product.usecase";
import GetStoreUseCase from "@usecases/store/get-store.usecase";
import GetPartnerUseCase from "@usecases/partner/get-partner.usecase";
import CreateProductUseCase from "@usecases/product/create-product.usecase";
import AddStoreDefaultFiscalCustomerUseCase from "@usecases/store/add-store-default-fiscal-customer.usecase";
import CreateStoreUseCase from "@usecases/store/create-store.usecase";
import GetAllClientsUseCase from "@usecases/store/get-all-clients.usecase";
import CreateUserUseCase from "@usecases/user/create-user.usecase";
import CreateServiceUseCase from "@usecases/product/create-service.usecase";
import GetAllServicesUseCase from "@usecases/product/get-all-services.usecase";
import GetServiceUseCase from "@usecases/product/get-service.usecase";

export const USECASE_PROVIDERS = [
  CreateOrganizationUseCase,
  CreateStoreUseCase,
  CreateUserUseCase,
  CreateProductUseCase,
  CreateServiceUseCase,
  CreateOrderUseCase,
  AddStoreDefaultFiscalCustomerUseCase,

  GetPartnerUseCase,
  GetAllPartnersUseCase,
  GetStoreUseCase,
  GetProductUseCase,
  GetServiceUseCase,
  GetAllProductsUseCase,
  GetAllServicesUseCase,
  GetAllCustomersUseCase,
  GetAllDocumentIssuersUseCase,
  GetAllProductTypesUseCase,
  GetAllClientsUseCase,
];
