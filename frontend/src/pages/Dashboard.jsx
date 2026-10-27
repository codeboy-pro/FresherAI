

const Dashboard = ({ user, }) => {
  return (
    <div className="text-green-700 text-4xl">
      Welcome {user?.name}
    </div>
  )
}

export default Dashboard
