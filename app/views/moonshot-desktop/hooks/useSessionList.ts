import { useGetAllSessionsQuery } from '../services/session-api-service';

export default function useSessionList() {
  const { data, error, isLoading } = useGetAllSessionsQuery();
  let sessions: Session[] = [];
  if (data !== undefined) {
    sessions = data;
  }
  return { sessions, error, isLoading };
}
