import { Link } from 'react-router-dom'
import {
  FaChartBar, FaStar, FaCalendar, FaMapMarkerAlt, FaUsers, FaClipboardList, FaBullseye, FaLock, FaRocket, FaHandshake, FaArrowRight
} from 'react-icons/fa'

export function Home() {
  const stats = [
    { label: 'Events Created', value: '250+' },
    { label: 'Feedback Collected', value: '15K+' },
    { label: 'Active Organizers', value: '80+' },
    { label: 'Avg Satisfaction', value: '4.7/5' }
  ]

  const featuredEvents = [
    {
      id: 1,
      title: 'Tech Summit 2026',
      date: 'June 15, 2025',
      location: 'Delhi',
      attendees: 1200,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Web Development Workshop',
      date: 'June 22, 2025',
      location: 'Mumbai, Maharashtra',
      attendees: 30,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'AI & Machine Learning Conference',
      date: 'July 5, 2025',
      location: 'Bangalore, Karnataka',
      attendees: 80,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1591453089816-0fbb469e7ae5?w=500&h=300&fit=crop'
    }
  ]

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Event Organizer',
      content: 'This platform made it so easy to collect and analyze feedback from our events. Highly recommend!',
      icon: FaClipboardList
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Conference Manager',
      content: 'The detailed analytics help us improve every event. Our attendees love the streamlined feedback process.',
      icon: FaChartBar
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Corporate Events Lead',
      content: 'Best investment for our event management. The insights we gained are invaluable for future events.',
      icon: FaStar
    }
  ]

  const features = [
    {
      icon: FaClipboardList,
      title: 'Easy Feedback Collection',
      description: 'Streamlined forms that attendees love. Get insightful responses in minutes, not days.'
    },
    {
      icon: FaChartBar,
      title: 'Real-time Analytics',
      description: 'Track feedback instantly with beautiful dashboards. Identify trends and opportunities immediately.'
    },
    {
      icon: FaBullseye,
      title: 'Actionable Insights',
      description: 'Get detailed reports with recommendations. Make data-driven decisions for your next event.'
    },
    {
      icon: FaLock,
      title: 'Secure & Private',
      description: 'Enterprise-grade security ensures attendee data is protected. Full GDPR compliance included.'
    },
    {
      icon: FaRocket,
      title: 'Lightning Fast',
      description: 'Lightning-fast platform built for scale. Handle thousands of responses without slowdown.'
    },
    {
      icon: FaHandshake,
      title: 'Easy Integration',
      description: 'Integrate seamlessly with your existing tools. Connect with popular event management platforms.'
    }
  ]

  return (
    <div className="bg-white">
      {/* Navbar with Glass Effects */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-white/40 to-primary-50/30 border-b border-primary-200/30 shadow-lg">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <FaChartBar className="text-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-transparent bg-clip-text" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 text-transparent bg-clip-text">EventHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/events" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Events
            </Link>
            <Link to="/feedback" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Feedback
            </Link>
            <Link to="/view-feedback" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Analytics
            </Link>
            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium transition">
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/events" className="btn btn-primary hidden sm:block py-2 px-6">
              Get Started
            </Link>
            <button className="md:hidden text-gray-900 text-xl">
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section container relative min-h-screen flex items-center">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-300 rounded-full blur-3xl opacity-20 -ml-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-400 rounded-full blur-3xl opacity-15 -mr-40 -mb-40"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              Capture Event Feedback Effortlessly
            </h1>
            <p className="text-lg text-gray-700">
              Empower your events with real-time feedback collection and comprehensive analytics to drive continuous improvement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/events" className="btn btn-primary flex items-center justify-center gap-2">
                Browse Events <FaArrowRight className="text-sm" />
              </Link>
              <Link to="/feedback" className="btn btn-secondary flex items-center justify-center gap-2">  Submit Feedback </Link>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-primary-300 rounded-lg blur-xl opacity-40"></div>
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=500&fit=crop" alt="Event Feedback Platform"
              className="rounded-lg shadow-2xl relative z-10 hover:shadow-primary-500/50 transition-all duration-300"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section section-bg container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-6 text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="section container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Events</h2>
          <p className="text-gray-600 text-lg">Explore upcoming events and share your valuable feedback</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredEvents.map((event) => (
            <article key={event.id} className="card overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex-1">{event.title}</h3>
                  <div className="flex items-center gap-1 text-primary-500 ml-2">
                    <FaStar className="text-sm" />
                    <span className="font-semibold text-sm">{event.rating}</span>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaCalendar className="text-primary-500 text-sm" />
                    {event.date}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaMapMarkerAlt className="text-primary-500 text-sm" />
                    {event.location}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaUsers className="text-primary-500 text-sm" />
                    {event.attendees} attendees
                  </p>
                </div>
                <Link to={`/feedback?eventId=${event.id}`}
                  className="btn btn-primary btn-sm w-full text-center">
                  Give Feedback </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center">
          <Link to="/events" className="btn btn-secondary inline-flex items-center gap-2"> View All Events
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="section section-bg container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Powerful Features</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div key={idx} className="card p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Icon className="text-4xl text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">What Our Users Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => {
            const Icon = testimonial.icon
            return (
              <div key={testimonial.id} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0">
                    <Icon className="text-2xl text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-sm" />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl opacity-10 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-500 rounded-full blur-3xl opacity-10 -ml-24 -mb-24"></div>

        <div className="container text-center text-white relative z-10">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Events?</h2>
          <p className="text-lg text-primary-100 mb-8">Start collecting meaningful feedback today. It takes just minutes to get started.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="btn bg-white text-primary-600 hover:bg-gray-100 font-semibold hover:shadow-xl"
            >
              Get Started
            </Link>
            <a href="#" className="btn border-2 border-white text-white hover:bg-white hover:bg-opacity-10 hover:shadow-lg transition-all"
            > Learn More </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-primary-900 to-gray-900 text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-5 -mr-32 -mt-32"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary-300">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/events" className="hover:text-primary-400 transition-colors">Events</Link></li>
                <li><Link to="/feedback" className="hover:text-primary-400 transition-colors">Feedback</Link></li>
                <li><Link to="/view-feedback" className="hover:text-primary-400 transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary-300">Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="hover:text-primary-400 transition-colors">About</a></li>
                <li><a href="#blog" className="hover:text-primary-400 transition-colors">Blog</a></li>
                <li><a href="#careers" className="hover:text-primary-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary-300">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#privacy" className="hover:text-primary-400 transition-colors">Privacy</a></li>
                <li><a href="#terms" className="hover:text-primary-400 transition-colors">Terms</a></li>
                <li><a href="#contact" className="hover:text-primary-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary-300">Follow Us</h4>
              <ul className="space-y-2">
                <li><a href="#twitter" className="hover:text-primary-400 transition-colors">Twitter</a></li>
                <li><a href="#linkedin" className="hover:text-primary-400 transition-colors">LinkedIn</a></li>
                <li><a href="#facebook" className="hover:text-primary-400 transition-colors">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Event Feedback System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
