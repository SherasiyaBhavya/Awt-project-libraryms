export default function Profile() {
  const profile = { name: 'Awt Student', email: 'student@college.edu', roll: 'CSE202401' }
  return (
    <section className="page-card">
      <h2>Profile</h2>
      <div style={{ marginTop: '1rem' }}>
        <strong>Name: </strong> {profile.name}<br />
        <strong>Email: </strong> {profile.email}<br />
        <strong>Roll Number: </strong> {profile.roll}
      </div>
    </section>
  )
}
