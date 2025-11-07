function SuccessAnimation({ message = "Analysis Complete!" }) {
  return (
    <div className="success-pulse text-center py-8">
      <div className="inline-block animate-bounce text-6xl mb-4">✅</div>
      <p className="text-xl font-bold text-green-600">{message}</p>
    </div>
  )
}

export default SuccessAnimation
