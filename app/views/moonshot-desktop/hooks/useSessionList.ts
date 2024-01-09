import { useGetSessionsQuery } from '../services/session-api-service';

export default function useSessionList() {
  const { data, error, isLoading } = useGetSessionsQuery();
  let sessions: Session[] = [];
  if (data !== undefined) {
    sessions = data;
  }
  return { sessions, error, isLoading };
}
