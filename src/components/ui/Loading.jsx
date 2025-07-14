import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';

const Loading = ({ type = 'dashboard' }) => {
  const shimmerVariants = {
    initial: { backgroundPosition: '-468px 0' },
    animate: { backgroundPosition: '468px 0' },
  };

  const DashboardLoading = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <motion.div
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="shimmer h-4 w-20 rounded"
              />
              <motion.div
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.1 }}
                className="shimmer h-8 w-16 rounded"
              />
              <motion.div
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.2 }}
                className="shimmer h-3 w-24 rounded"
              />
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="shimmer h-6 w-32 rounded mb-4"
          />
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.3 }}
            className="shimmer h-64 w-full rounded"
          />
        </Card>
        
        <Card className="p-6">
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="shimmer h-6 w-28 rounded mb-4"
          />
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: i * 0.1 }}
                className="shimmer h-12 w-full rounded"
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const BoardLoading = () => (
    <div className="flex space-x-6 p-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex-1 bg-white rounded-lg p-4">
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="shimmer h-6 w-24 mb-4 rounded"
          />
          <div className="space-y-3">
            {[1, 2, 3].map(j => (
              <motion.div
                key={j}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: j * 0.1 }}
                className="shimmer h-24 rounded-lg"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const TableLoading = () => (
    <div className="p-6">
      <div className="bg-white rounded-lg overflow-hidden">
        <motion.div
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="shimmer h-12 w-full mb-4"
        />
        {[1, 2, 3, 4, 5].map(i => (
          <motion.div
            key={i}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: i * 0.1 }}
            className="shimmer h-16 w-full mb-2"
          />
        ))}
      </div>
    </div>
  );

  switch (type) {
    case 'board':
      return <BoardLoading />;
    case 'table':
      return <TableLoading />;
    default:
      return <DashboardLoading />;
  }
};

export default Loading;