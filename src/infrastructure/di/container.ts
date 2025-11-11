// Dependency Injection Container

import { ConversationRepository } from '../../data/repositories/ConversationRepository';
import { AttendantRepository } from '../../data/repositories/AttendantRepository';
import { MetricsRepository } from '../../data/repositories/MetricsRepository';

import { GetConversations } from '../../domain/use-cases/GetConversations';
import { GetConversationMessages } from '../../domain/use-cases/GetConversationMessages';
import { AssignConversationToAttendant } from '../../domain/use-cases/AssignConversationToAttendant';
import { SendMessage } from '../../domain/use-cases/SendMessage';
import { GetAttendants } from '../../domain/use-cases/GetAttendants';
import { GetDashboardMetrics } from '../../domain/use-cases/GetDashboardMetrics';

// Repositories (Singleton instances)
const conversationRepository = new ConversationRepository();
const attendantRepository = new AttendantRepository();
const metricsRepository = new MetricsRepository();

// Use Cases
export const getConversationsUseCase = new GetConversations(conversationRepository);
export const getConversationMessagesUseCase = new GetConversationMessages(conversationRepository);
export const assignConversationToAttendantUseCase = new AssignConversationToAttendant(conversationRepository);
export const sendMessageUseCase = new SendMessage(conversationRepository);
export const getAttendantsUseCase = new GetAttendants(attendantRepository);
export const getDashboardMetricsUseCase = new GetDashboardMetrics(metricsRepository);

// Metrics Repository (direct access for complex queries)
export { metricsRepository };
