// Dependency Injection Container

import { ConversationRepository } from '../../data/repositories/ConversationRepository';
import { MetricsRepository } from '../../data/repositories/MetricsRepository';
import { CompanyRepository } from '../../data/repositories/CompanyRepository';
import { UserRepository } from '../../data/repositories/UserRepository';
import { AuthRepository } from '../../data/repositories/AuthRepository';
import { CustomerRepository } from '../../data/repositories/CustomerRepository';
import { AttendantStatsRepository } from '../../data/repositories/AttendantStatsRepository';

import { GetConversations } from '../../domain/use-cases/GetConversations';
import { GetConversationMessages } from '../../domain/use-cases/GetConversationMessages';
import { AssignConversationToAttendant } from '../../domain/use-cases/AssignConversationToAttendant';
import { SendMessage } from '../../domain/use-cases/SendMessage';
import { GetDashboardMetrics } from '../../domain/use-cases/GetDashboardMetrics';
import { SearchConversations } from '../../domain/use-cases/conversation/SearchConversations';
import { GetUnassignedConversations } from '../../domain/use-cases/conversation/GetUnassignedConversations';

// Auth Use Cases
import { Login } from '../../domain/use-cases/auth/Login';
import { Logout } from '../../domain/use-cases/auth/Logout';
import { ValidateSession } from '../../domain/use-cases/auth/ValidateSession';

// User Use Cases
import { CreateUser } from '../../domain/use-cases/user/CreateUser';
import { GetUsersByCompany } from '../../domain/use-cases/user/GetUsersByCompany';
import { UpdateUser } from '../../domain/use-cases/user/UpdateUser';
import { DeleteUser } from '../../domain/use-cases/user/DeleteUser';
import { SearchUsers } from '../../domain/use-cases/user/SearchUsers';
import { CheckPermission } from '../../domain/use-cases/user/CheckPermission';

// Customer Use Cases
import { GetCustomersByCompany } from '../../domain/use-cases/customer/GetCustomersByCompany';
import { SearchCustomers } from '../../domain/use-cases/customer/SearchCustomers';
import { CreateCustomer } from '../../domain/use-cases/customer/CreateCustomer';

// Repositories (Singleton instances)
const conversationRepository = new ConversationRepository();
const metricsRepository = new MetricsRepository();
const companyRepository = new CompanyRepository();
const userRepository = new UserRepository();
const authRepository = new AuthRepository(userRepository, companyRepository);
const customerRepository = new CustomerRepository();
const attendantStatsRepository = new AttendantStatsRepository();

// Conversation Use Cases
export const getConversationsUseCase = new GetConversations(conversationRepository);
export const getConversationMessagesUseCase = new GetConversationMessages(conversationRepository);
export const assignConversationToAttendantUseCase = new AssignConversationToAttendant(conversationRepository);
export const sendMessageUseCase = new SendMessage(conversationRepository);
export const searchConversationsUseCase = new SearchConversations(conversationRepository);
export const getUnassignedConversationsUseCase = new GetUnassignedConversations(conversationRepository);

// Metrics Use Cases
export const getDashboardMetricsUseCase = new GetDashboardMetrics(metricsRepository);

// Auth Use Cases
export const loginUseCase = new Login(authRepository);
export const logoutUseCase = new Logout(authRepository);
export const validateSessionUseCase = new ValidateSession(authRepository);

// User Use Cases
export const createUserUseCase = new CreateUser(userRepository);
export const getUsersByCompanyUseCase = new GetUsersByCompany(userRepository);
export const updateUserUseCase = new UpdateUser(userRepository);
export const deleteUserUseCase = new DeleteUser(userRepository);
export const searchUsersUseCase = new SearchUsers(userRepository);
export const checkPermissionUseCase = new CheckPermission();

// Customer Use Cases
export const getCustomersByCompanyUseCase = new GetCustomersByCompany(customerRepository);
export const searchCustomersUseCase = new SearchCustomers(customerRepository);
export const createCustomerUseCase = new CreateCustomer(customerRepository);

// Metrics Repository (direct access for complex queries)
export { metricsRepository, attendantStatsRepository };
