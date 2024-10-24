import React, { useState, useEffect } from 'react'
import { teams as initialTeams } from '../data/teamData' // Import the initial team data
import TeamBlock from './TeamBlock'

const Teams = () => {
  const [teams, setTeams] = useState(() => {
    // Load teams from local storage if available, otherwise use initial teams
    const savedTeams = localStorage.getItem('teamsData');
    return savedTeams ? JSON.parse(savedTeams) : initialTeams;
  });

  // Save to localStorage whenever teams state is updated
  useEffect(() => {
    localStorage.setItem('teamsData', JSON.stringify(teams));
  }, [teams]);

  // Function to handle difficulty level changes
  const handleDifficultyChange = (teamIndex, action) => {
    const updatedTeams = teams.map((team, index) => {
      if (index === teamIndex) {
        let newLevel;
        if (action === 'increase') {
          newLevel = team.difficulty_level + 1;
        } else {
          newLevel = team.difficulty_level - 1;
        }
        return {
          ...team,
          difficulty_level: Math.max(1, Math.min(newLevel, 5)), // Prevent below 1 and above 5
        };
      }
      return team;
    });
    setTeams(updatedTeams);
  };  

  // Function to toggle member's status
  const handleToggleMemberStatus = (teamIndex, memberIndex) => {
    const updatedTeams = teams.map((team, index) => {
      if (index === teamIndex) {
        const updatedMembers = team.members.map((member, idx) => {
          if (idx === memberIndex) {
            return {
              ...member,
              status: member.status === 'participating' ? 'eliminated' : 'participating',
            };
          }
          return member;
        });
        return {
          ...team,
          members: updatedMembers,
        };
      }
      return team;
    });
    setTeams(updatedTeams);
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center mt-6">Teams</h2>

      {/* Grid layout for teams with 4 columns on large screens, 2 on medium, 1 on small */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teams.map((team, index) => (
          <TeamBlock
            key={index}
            team={team}
            index={index}
            handleDifficultyChange={handleDifficultyChange}
            handleToggleMemberStatus={handleToggleMemberStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default Teams;
