import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { collection, query, where, onSnapshot, documentId, getDocs } from 'firebase/firestore';
import dayjs from 'dayjs';
import { db } from '../../Utils/firebase';

export function useTasks(statusFilter, dateFilter) {
  const { auth } = useSelector((state) => state.auth);
  const [tasksList, setTasksList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const taskRef = collection(db, 'tasks');
    const taskQuery =
      auth.data.role === 'admin'
        ? query(taskRef)
        : query(taskRef, where('assignedTo', '==', auth.data.id));

    const unsubscribe = onSnapshot(taskQuery, async (snapshot) => {
      try {
        const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (tasks.length === 0) { setTasksList([]); setLoading(false); return; }

        const userIds = [...new Set(tasks.map((t) => t.assignedTo).filter(Boolean))];
        let usersMap = {};

        if (userIds.length > 0) {
          const batches = [];
          for (let i = 0; i < userIds.length; i += 10) batches.push(userIds.slice(i, i + 10));
          const snaps = await Promise.all(
            batches.map((batch) => getDocs(query(collection(db, 'users'), where(documentId(), 'in', batch))))
          );
          snaps.forEach((snap) => snap.forEach((doc) => { usersMap[doc.id] = { id: doc.id, ...doc.data() }; }));
        }

        let filtered = tasks.map((task) => ({
          ...task,
          assignedUserDetails: usersMap[task.assignedTo] || { email: 'Unassigned' },
        }));

        if (statusFilter) filtered = filtered.filter((t) => t.status === statusFilter);
        if (dateFilter) filtered = filtered.filter((t) => dayjs(t.dueDate).format('YYYY-MM-DD') === dateFilter);

        setTasksList(filtered);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setLoading(false);
      }
    }, (err) => { console.error('Permission Error:', err); setLoading(false); });

    return () => unsubscribe();
  }, [auth.data.id, auth.data.role, statusFilter, dateFilter]);

  return { tasksList, isLoading };
}