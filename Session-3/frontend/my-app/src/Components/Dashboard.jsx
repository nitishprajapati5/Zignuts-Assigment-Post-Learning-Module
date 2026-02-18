import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTask } from '../Store/TaskSlice/taskSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTask());
    }
  }, [status, dispatch]);

  console.log(items)

  return (
    <div>
      <h2>Your Tasks</h2>
      
      {status === 'loading' && <p>Loading tasks...</p>}
      
      {status === 'failed' && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {status === 'succeeded' && (
        <ul>
          {items.tasksWithOwner.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;