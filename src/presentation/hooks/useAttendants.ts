import { useState, useEffect } from "react";

import { Attendant } from "../../domain/entities/Attendant";
import { getAttendantsUseCase } from "../../infrastructure/di/container";

export function useAttendants() {
  const [attendants, setAttendants] = useState<Attendant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadAttendants();
  }, []);

  const loadAttendants = async () => {
    try {
      setLoading(true);
      const data = await getAttendantsUseCase.execute();
      setAttendants(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { attendants, loading, error, reload: loadAttendants };
}
