'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpen,
  Play,
  Download,
  Star,
  Clock,
  User,
  TrendingUp,
  Calculator,
  Shield,
  Target
} from 'lucide-react'
import PageHeader from '@/components/dashboard/page-header'

const mockGuides = [
  {
    id: 1,
    title: 'Getting Started with Real Estate Investment',
    description: 'Learn the basics of real estate investing and how to get started',
    duration: '15 min',
    difficulty: 'Beginner',
    rating: 4.8,
    views: 1240,
    type: 'video',
    category: 'Basics'
  },
  {
    id: 2,
    title: 'Understanding ROI and Cash Flow',
    description: 'Master the key metrics for evaluating investment properties',
    duration: '25 min',
    difficulty: 'Intermediate',
    rating: 4.9,
    views: 890,
    type: 'article',
    category: 'Analysis'
  },
  {
    id: 3,
    title: 'Market Analysis Techniques',
    description: 'Learn how to analyze local markets and identify opportunities',
    duration: '30 min',
    difficulty: 'Advanced',
    rating: 4.7,
    views: 567,
    type: 'video',
    category: 'Analysis'
  },
  {
    id: 4,
    title: 'Financing Your First Investment',
    description: 'Understanding different financing options for real estate investors',
    duration: '20 min',
    difficulty: 'Intermediate',
    rating: 4.6,
    views: 723,
    type: 'article',
    category: 'Financing'
  }
]

const mockTools = [
  {
    name: 'ROI Calculator',
    description: 'Calculate potential returns on investment properties',
    icon: Calculator,
    category: 'Analysis'
  },
  {
    name: 'Market Research Tool',
    description: 'Research local market trends and data',
    icon: TrendingUp,
    category: 'Research'
  },
  {
    name: 'Risk Assessment',
    description: 'Evaluate investment risks and mitigation strategies',
    icon: Shield,
    category: 'Risk Management'
  },
  {
    name: 'Goal Setting',
    description: 'Set and track your investment goals',
    icon: Target,
    category: 'Planning'
  }
]

export default function InvestmentGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Basics', 'Analysis', 'Financing', 'Risk Management', 'Planning']

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <PageHeader
        title="Investment Guide"
        description="Learn about real estate investing and access helpful tools"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Resources
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Progress</CardTitle>
            <CardDescription>
              Track your progress through our investment courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Courses Completed</h3>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Hours Learned</h3>
                <p className="text-2xl font-bold text-green-600">24</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Average Rating</h3>
                <p className="text-2xl font-bold text-purple-600">4.8</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Goals Set</h3>
                <p className="text-2xl font-bold text-orange-600">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Learning Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Resources</CardTitle>
            <CardDescription>
              Educational content to help you become a better investor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockGuides.map((guide) => (
                <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {guide.type === 'video' ? (
                          <Play className="w-4 h-4 text-red-600" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        )}
                        <span className="text-xs font-medium text-gray-600">{guide.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{guide.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{guide.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{guide.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>{guide.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3" />
                        <span>{guide.views} views</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        guide.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        guide.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {guide.difficulty}
                      </span>
                      <Button size="sm" variant="outline">
                        Start Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Investment Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Tools</CardTitle>
            <CardDescription>
              Useful tools and calculators for your investment journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockTools.map((tool) => (
                <Card key={tool.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <tool.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Open Tool
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Start Small</h4>
                    <p className="text-sm text-gray-600">Begin with a single property to learn the ropes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Focus on Cash Flow</h4>
                    <p className="text-sm text-gray-600">Prioritize properties with positive monthly cash flow</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Research Markets</h4>
                    <p className="text-sm text-gray-600">Thoroughly research local market conditions before investing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Build a Team</h4>
                    <p className="text-sm text-gray-600">Surround yourself with experienced professionals</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common Mistakes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Overpaying</h4>
                    <p className="text-sm text-gray-600">Don't let emotions drive your purchase decisions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Skipping Due Diligence</h4>
                    <p className="text-sm text-gray-600">Always inspect properties and review financials thoroughly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Ignoring Expenses</h4>
                    <p className="text-sm text-gray-600">Account for all costs including maintenance and vacancies</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Poor Location Choice</h4>
                    <p className="text-sm text-gray-600">Location is crucial for long-term appreciation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 