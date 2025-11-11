import { IMetricsRepository } from '../repositories/IMetricsRepository';
import { DashboardMetrics } from '../entities/Metrics';

export class GetDashboardMetrics {
  constructor(private metricsRepository: IMetricsRepository) {}

  async execute(): Promise<DashboardMetrics> {
    return await this.metricsRepository.getDashboardMetrics();
  }
}
