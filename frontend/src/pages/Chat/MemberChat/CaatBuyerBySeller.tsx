
import { Avatar, Button, message ,Modal} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { MessageInterface } from "../../../interfaces/IMessage";
import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { PictureTwoTone } from '@ant-design/icons';
import {
  CreateMessage,
  GetMemberById,
  GetMemberBySeller,
  GetMessage,
  GetRoomChatByMemberAndSellerID,
  RoomChatByMemberID,
  GetSellerByMemberId,
} from "../../../services/http/index";
import "../test.css";
import { MemberInterface } from "../../../interfaces/Member";
import Navbarseller from "../../../component/navbarSeller";

interface MemberBySeller {
  MemberID: number;
  Username: string;
  Password: string;
  Email: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Address: string;
  ProfilePic: string;
  SellerID: string;
}

const Test: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // สำหรับเปิด/ปิด Modal
  const navigate = useNavigate();
  const [chatMembers, setChatMembers] = useState<MemberBySeller[]>([]);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [inputMessage, setInputMessage] = useState("");
  const [roomChatID, setRoomChatID] = useState<number | null>(null);
  const [selectedSellerID, setSelectedSellerID] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const MemberID = Number(localStorage.getItem("id"));
  const senderID = 2; // ID ของผู้ส่งข้อความ

  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<MemberBySeller[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // ส่วนที่เพิ่มมาใหม่ ****start
  const [mid, setMid] = useState<number | null>(null); // เริ่มต้นด้วย null
  const [member, setMember] = useState<MemberInterface | null>(null);

  const GetMemberId = async (member_id: number) => {
    try {
      let res = await GetMemberById(member_id);
      if (res.status === 200) {
        setMember(res.data);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
      });
    }
  };


  useEffect(() => {
    const storedId = Number(localStorage.getItem("id"));
    if (storedId) {
      setMid(Number(storedId));
    }
  }, []);

  // useEffect ที่ใช้ในการเรียก GetMemberId เมื่อ mid เปลี่ยนแปลงและไม่เป็น null
  useEffect(() => {
    if (mid !== null) {
      console.log(mid);
      GetMemberId(mid);
    }
  }, [mid]);
  // ส่วนที่เพิ่มมาใหม่******* end

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
      picture_content: selectedImage || "",
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
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อความ",
      });
    }
    setLoading(false);
  };

  const fetchChatMembers = async () => {
    setLoading(true);
    try {
      const rooms = await RoomChatByMemberID(MemberID);
      const memberPromises = rooms.map(async (room: any) => {
        if (room.SellerID) {
          const sellerData = await GetMemberBySeller(room.SellerID);
          if (sellerData) {
            return { ...sellerData, SellerID: room.SellerID };
          }
        }
        return null;
      });

      const members = await Promise.all(memberPromises);
      setChatMembers(members.filter((member) => member !== null) as MemberBySeller[]);
    } catch (error) {
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการดึงรายชื่อคนที่เราแชทด้วย" });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (mid !== null) {
      fetchChatMembers();
    }
  }, [mid]);

  useEffect(() => {
    if (selectedSellerID) {
      fetchMessages();
    }
  }, [selectedSellerID]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChatMemberSelect = async (sellerID: string) => {
    if (mid === null) {
      messageApi.open({ type: "error", content: "ไม่พบ ID สมาชิก" });
      return;
    }
    const sellerIDNumber = Number(sellerID);
    try {
      const room = await GetRoomChatByMemberAndSellerID(mid, sellerIDNumber); // mid is guaranteed to be a number here
      if (room && room.RoomID) {
        setRoomChatID(room.RoomID);
        setSelectedSellerID(sellerID);
      } else {
        messageApi.open({ type: "error", content: "ไม่พบห้องแชท" });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลห้องแชท",
      });
    }
  };
  //---------------**
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
  // ฟังก์ชันสำหรับคลิกเลือกจากผลการค้นหา
  const handleChatMemberSelectFromSearch = (member: MemberBySeller) => {
    handleChatMemberSelect(member.SellerID); // เรียกใช้ฟังก์ชันดึงห้องแชทโดยใช้ SellerID
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

//--------------**
  const selectedChatMember = chatMembers.find(
    (member) => member.SellerID === selectedSellerID
  );
  const handleHome = async () => {
    if (mid === null) {
      messageApi.open({ type: "error", content: "ไม่พบ ID สมาชิก" });
      return;
    }
  
    try {
      const sellerData = await GetSellerByMemberId(mid);
      if (sellerData && sellerData.error) {
        messageApi.open({
          type: "error",
          content: sellerData.error,
        });
        navigate('/HomeMember');
      } else if (sellerData) {
        navigate('/HomeSeller');
      } else {
        navigate('/HomeMember');
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ขาย",
      });
    }
  };
  
  
  return (
    <div className="container">
      {/* {contextHolder} */}
      <Navbarseller/>
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
              onClick={() => handleChatMemberSelect(chatMember.SellerID)}
            >
              <Avatar
                src={chatMember.ProfilePic}
                alt={`Contact ${chatMember.MemberID}`}
                size="large"
              />
              <div>
                {chatMember.FirstName} {chatMember.LastName}
              </div>
              <div className="status"></div>
            </div>
          ))
        ) : (
          <div>ไม่มีสมาชิกที่แชทด้วย</div>
        )}
      </div>

      <div className="chat">
        <div className="chat-header">
        <div className="home-icon">
               <HomeOutlined onClick={handleHome}/>
             </div>
          {selectedChatMember && (
            <>
              <Avatar src={selectedChatMember.ProfilePic} alt="Profile" size="large" />
              <div>
                {selectedChatMember.FirstName} {selectedChatMember.LastName}
              </div>
            </>
          )}
          <div className="icons">
          </div>
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

