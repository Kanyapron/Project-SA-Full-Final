
import { PictureTwoTone } from '@ant-design/icons'; //--------------------เพิ่มรูป--------------------------
import { Avatar, Button, Modal, message } from "antd";
import React, { useEffect, useRef, useState } from 'react';
import { MessageInterface } from "../../../interfaces/IMessage";
import { SellerInterface } from '../../../interfaces/Seller';
import { CreateMessage, GetMember, GetMessage, GetRoomChatByMemberAndSellerID, GetSellerByMemberId, RoomChatBySellerID } from "../../../services/http";
import '../test.css';
import NavbarSeller from '../../../component/navbarSeller';
interface Member {
  MemberID: number;
  Username: string;
  Password: string;
  Email: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Address: string;
  ProfilePic: string;
}

const Test: React.FC = () => {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [inputMessage, setInputMessage] = useState("");
  const [roomChatID, setRoomChatID] = useState<number | null>(null);
  const [selectedSellerID, setSelectedSellerID] = useState<number | null>(null);
  const [chatMembers, setChatMembers] = useState<Member[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // สำหรับเปิด/ปิด Modal

  const [seller, setSeller] = useState<SellerInterface | null>(null);
  const [sellerID, setSellerID] = useState<number | null>(null); // ตั้งค่า sellerID
  const selectedChatMember = chatMembers.find(member => member.MemberID === selectedSellerID);

  const [searchName, setSearchName] = useState('');  //-----------------------เกี่ยวกับ Search-------------------//
  const [searchResults, setSearchResults] = useState<Member[]>([]);
   //-----------------------เกี่ยวกับ Search-------------------//

  const [selectedImage, setSelectedImage] = useState<File | null>(null);//-------สำหรับรูป----------

  const senderID = 1; // ID ของผู้ส่งข้อความ

  // Function to fetch seller by member_id
  const fetchSeller = async (member_id: number) => {
    const res = await GetSellerByMemberId(member_id); // Call the function
    if (!res.error) {
      setSeller(res.seller); // Set the seller object
      setSellerID(res.seller_id); // Set the seller ID
    } else {
      message.error(res.error); // Display error message if any
    }
  };

  const onFinish = async () => {
    if (!inputMessage.trim() && !selectedImage) {
        messageApi.open({ type: "error", content: "กรุณากรอกข้อความ" });
        return;
    }

    if (roomChatID === null) {
        messageApi.open({ type: "error", content: "ไม่พบห้องแชท" });
        return;
    }

    const messageData: MessageInterface = {
        room_chat_id: roomChatID,
        content: inputMessage,
        picture_content: selectedImage || "", // ใช้ Base64 ที่แปลงแล้ว
        sender_id: senderID,
    };

    try {
        const res = await CreateMessage(messageData);
        if (res) {
            messageApi.open({ type: "success", content: "บันทึกข้อความสำเร็จ" });
            setInputMessage("");
            setSelectedImage(null); // ล้างการเลือกไฟล์หลังส่ง
            fetchMessages();
        } else {
            messageApi.open({ type: "error", content: "เกิดข้อผิดพลาด !" });
        }
    } catch (error) {
        messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการส่งข้อความ" });
    }
};


  const fetchMessages = async () => {
    if (roomChatID === null) return;
    setLoading(true);
    try {
      const data = await GetMessage(roomChatID);
      setMessages(Array.isArray(data) ? data : [data]);
    } catch (error) {
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการดึงข้อความ" });
    }
    setLoading(false);
  };

  const fetchChatMembers = async () => {
    if (!sellerID) return; // ตรวจสอบว่า sellerID ไม่เป็น null
    setLoading(true);
    try {
      const rooms = await RoomChatBySellerID(sellerID);
      console.log('Rooms:', rooms); // ตรวจสอบว่าได้ค่าห้องถูกต้องหรือไม่
      const memberPromises = rooms.map(async (room: any) => {
        if (room.MemberID) {
          const memberData = await GetMember(room.MemberID);
          console.log('Member Data:', memberData); // ตรวจสอบว่าข้อมูลสมาชิกที่ได้ถูกต้องหรือไม่
          if (memberData) {
            return Array.isArray(memberData) ? { ...memberData[0], MemberID: room.MemberID } : { ...memberData, MemberID: room.MemberID };
          }
        }
        return null;
      });
  
      const members = await Promise.all(memberPromises);
      setChatMembers(members.filter((member) => member !== null) as Member[]);
    } catch (error) {
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการดึงรายชื่อคนที่เราแชทด้วย" });
    }
    setLoading(false);
  };
  
  useEffect(() => {
    const memberId = Number(localStorage.getItem("id")); // Assuming member_id is stored in localStorage
    if (memberId) {
      fetchSeller(memberId); // Fetch seller using the member ID
    }
  }, []);

  useEffect(() => {
    if (sellerID) {
      fetchChatMembers(); // ดึงรายชื่อคนที่เคยแชทด้วยเมื่อ sellerID เปลี่ยนแปลง
    }
  }, [sellerID]);

  useEffect(() => {
    if (selectedSellerID) {
      fetchMessages(); // ดึงข้อความเมื่อมีการเลือกผู้ใช้ที่ต้องการแชทด้วย
    }
  }, [selectedSellerID]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChatMemberSelect = async (memberID: number) => {
    try {
      if (!sellerID) return; // ตรวจสอบว่า sellerID ไม่เป็น null ก่อนที่จะเรียก API
      const room = await GetRoomChatByMemberAndSellerID(memberID, sellerID);
      if (room && room.RoomID) {
        setRoomChatID(room.RoomID);
        setSelectedSellerID(memberID); // ใช้ memberID แทน sellerID
      } else {
        messageApi.open({ type: "error", content: "ไม่พบห้องแชท" });
      }
    } catch (error) {
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการดึงข้อมูลห้องแชท" });
    }
  };

    //---------------------------เพิ่มรูป----------------------------
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              // แปลงไฟล์เป็น Base64
              const base64String = reader.result as string;
              setSelectedImage(base64String); // เก็บ Base64 ใน state
          };
          reader.readAsDataURL(file); // เริ่มอ่านไฟล์
      }
  };
  // ฟังก์ชันสำหรับเปิด modal พร้อมแสดงรูปภาพที่ถูกเลือก
  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedImage(null); // ล้างค่ารูปเมื่อปิด modal
  };
    
    //---------------------------เพิ่มรูป----------------------------


  //--------------------------เพิ่มเพื่อ Search------------------------
 // ฟังก์ชันสำหรับคลิกเลือกจากผลการค้นหา
 const handleChatMemberSelectFromSearch = (member: Member) => {
  handleChatMemberSelect(member.MemberID); // เรียกใช้ฟังก์ชันดึงห้องแชทโดยใช้ SellerID
  setSearchResults([]); // ล้างผลการค้นหา
  setSearchName(""); // ล้างข้อความในช่องค้นหา
};

const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  const name = event.target.value;
  setSearchName(name);

  if (name.length > 0) {
    const filteredMembers = chatMembers.filter(member =>
      member.FirstName.toLowerCase().includes(name.toLowerCase()) ||
      member.LastName.toLowerCase().includes(name.toLowerCase())
    );
    setSearchResults(filteredMembers);
  } else {
    setSearchResults([]); // ถ้าไม่มีการค้นหา
  }
};
//--------------------------เพิ่มเพื่อ Search------------------------


  
  return (
    <div className="container">
      <NavbarSeller/>
      {/* {contextHolder} */}
      {/* -----------------------เกี่ยวกับ Search------------------- */}
      <div className="sidebar">                                   
        <input
          type="text"
          placeholder="ค้นหา (3K)"
          value={searchName}
          onChange={handleSearch}
        />
        <ul>
          {searchResults.length > 0 ? (
            searchResults.map((member) => (
              <li
                key={member.MemberID}
                onClick={() => handleChatMemberSelectFromSearch(member)}
                style={{ cursor: "pointer" }} // เพิ่ม cursor เพื่อให้รู้ว่าเป็นการคลิกได้
              >
                {member.FirstName} {member.LastName}
              </li>
            ))
          ) : (
            <li>ไม่มีผลลัพธ์</li>
          )}
        </ul>

        {chatMembers.length > 0 ? (
          chatMembers.map((chatMember) => (
            <div
              className="contact"
              key={chatMember.MemberID}
              onClick={() => handleChatMemberSelect(chatMember.MemberID)}
            >
              <Avatar src={chatMember.ProfilePic} alt={`Contact ${chatMember.MemberID}`} size="large" />
              <div>{chatMember.FirstName} {chatMember.LastName}</div>
              <div className="status"></div>
            </div>
          ))
        ) : (
          <div>ไม่มีสมาชิกที่แชทด้วย</div>
        )}
      </div>
{/* -----------------------เกี่ยวกับ Search------------------- */}
      <div className="chat">
        <div className="chat-header">
          {selectedChatMember && (
            <>
              <Avatar src={selectedChatMember.ProfilePic} alt="Profile" size="large" />
              <div className="chat-member-info">
                <div className="chat-member-name">{selectedChatMember.FirstName} {selectedChatMember.LastName}</div>
              </div>
            </>
          )}
        </div>

        <div className="chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.SenderID === senderID ? 'current-user' : 'other-user'}`}
          >
            {msg.Content && <div className="text">{msg.Content}</div>}

            {/* แสดงรูปภาพถ้ามี และเมื่อคลิกจะขยาย */}
            {msg.PictureContent && (
              <img
                src={msg.PictureContent}
                alt={`Sent image ${index}`}
                style={{ maxWidth: '200px', marginTop: '10px', cursor: 'pointer' }}
                onClick={() => handleImageClick(msg.PictureContent)} // เมื่อคลิกจะแสดง modal
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
        </div>


           <div className="chat-footer">
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="file-input"
            onChange={handleImageSelect}
          />
          <label htmlFor="file-input">
            <PictureTwoTone
              style={{ fontSize: '30px', cursor: 'pointer', marginRight: '10px' }}
            />
          </label>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            onKeyDown={(e) => e.key === 'Enter' && onFinish()}
          />
          <Button type="primary" onClick={onFinish} style={{ marginLeft: '10px' }}>
            ส่ง
          </Button>
        </div>
      </div>
      <Modal visible={isModalOpen} footer={null} onCancel={handleModalClose} centered>
        {selectedImage && <img src={selectedImage} alt="Enlarged" style={{ width: '100%' }} />}
      </Modal>
    </div>
  );
};

export default Test;